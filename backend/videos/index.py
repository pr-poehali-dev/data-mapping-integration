import json
import os
import uuid
import base64
import psycopg2
import boto3

SCHEMA = os.environ['MAIN_DB_SCHEMA']
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'admin123')


def get_db():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def handler(event: dict, context) -> dict:
    """Управление видео: список, загрузка (admin), удаление (admin)"""
    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Password',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    method = event.get('httpMethod', 'GET')
    path = event.get('path', '/')

    # GET /videos — список видео
    if method == 'GET':
        params = event.get('queryStringParameters') or {}
        category = params.get('category')

        conn = get_db()
        cur = conn.cursor()
        if category:
            cur.execute(
                f"SELECT id, title, description, category, video_url, thumbnail_url, duration, created_at FROM {SCHEMA}.videos WHERE category = '{category}' ORDER BY created_at DESC"
            )
        else:
            cur.execute(
                f"SELECT id, title, description, category, video_url, thumbnail_url, duration, created_at FROM {SCHEMA}.videos ORDER BY created_at DESC"
            )
        rows = cur.fetchall()
        cur.execute(f"SELECT DISTINCT category FROM {SCHEMA}.videos WHERE category IS NOT NULL ORDER BY category")
        categories = [r[0] for r in cur.fetchall()]
        conn.close()

        videos = [
            {
                'id': r[0], 'title': r[1], 'description': r[2],
                'category': r[3], 'video_url': r[4], 'thumbnail_url': r[5],
                'duration': r[6], 'created_at': str(r[7])
            }
            for r in rows
        ]
        return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'videos': videos, 'categories': categories}, ensure_ascii=False)}

    # POST /videos — загрузка видео (admin)
    if method == 'POST':
        headers = event.get('headers') or {}
        pwd = headers.get('x-admin-password') or headers.get('X-Admin-Password', '')
        if pwd != ADMIN_PASSWORD:
            return {'statusCode': 403, 'headers': cors, 'body': json.dumps({'error': 'Forbidden'})}

        body = json.loads(event.get('body') or '{}')
        title = body.get('title', '').strip()
        description = body.get('description', '').strip()
        category = body.get('category', '').strip()
        duration = body.get('duration', '').strip()
        video_b64 = body.get('video_data')
        thumb_b64 = body.get('thumbnail_data')
        video_ext = body.get('video_ext', 'mp4')
        thumb_ext = body.get('thumb_ext', 'jpg')

        if not title or not video_b64:
            return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'title and video_data required'})}

        s3 = boto3.client(
            's3',
            endpoint_url='https://bucket.poehali.dev',
            aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
            aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
        )
        key_id = os.environ['AWS_ACCESS_KEY_ID']
        video_key = f"videos/{uuid.uuid4()}.{video_ext}"
        s3.put_object(Bucket='files', Key=video_key, Body=base64.b64decode(video_b64), ContentType=f'video/{video_ext}')
        video_url = f"https://cdn.poehali.dev/projects/{key_id}/files/{video_key}"

        thumbnail_url = None
        if thumb_b64:
            thumb_key = f"videos/thumbnails/{uuid.uuid4()}.{thumb_ext}"
            s3.put_object(Bucket='files', Key=thumb_key, Body=base64.b64decode(thumb_b64), ContentType=f'image/{thumb_ext}')
            thumbnail_url = f"https://cdn.poehali.dev/projects/{key_id}/files/{thumb_key}"

        conn = get_db()
        cur = conn.cursor()
        thumb_val = f"'{thumbnail_url}'" if thumbnail_url else 'NULL'
        cat_val = f"'{category}'" if category else 'NULL'
        dur_val = f"'{duration}'" if duration else 'NULL'
        desc_val = description.replace("'", "''")
        title_val = title.replace("'", "''")
        cur.execute(
            f"INSERT INTO {SCHEMA}.videos (title, description, category, video_url, thumbnail_url, duration) "
            f"VALUES ('{title_val}', '{desc_val}', {cat_val}, '{video_url}', {thumb_val}, {dur_val}) RETURNING id"
        )
        new_id = cur.fetchone()[0]
        conn.commit()
        conn.close()

        return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'id': new_id, 'video_url': video_url, 'thumbnail_url': thumbnail_url})}

    # DELETE /videos — удаление видео (admin)
    if method == 'DELETE':
        headers = event.get('headers') or {}
        pwd = headers.get('x-admin-password') or headers.get('X-Admin-Password', '')
        if pwd != ADMIN_PASSWORD:
            return {'statusCode': 403, 'headers': cors, 'body': json.dumps({'error': 'Forbidden'})}

        params = event.get('queryStringParameters') or {}
        video_id = params.get('id')
        if not video_id:
            return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'id required'})}

        conn = get_db()
        cur = conn.cursor()
        cur.execute(f"DELETE FROM {SCHEMA}.videos WHERE id = {video_id}")
        conn.commit()
        conn.close()
        return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'ok': True})}

    return {'statusCode': 405, 'headers': cors, 'body': json.dumps({'error': 'Method not allowed'})}
