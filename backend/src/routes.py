import io
import json
import re
from urllib.request import urlopen, Request

import pdftotext
import requests
from bs4 import BeautifulSoup
from flask import request, abort

from src.app import app


@app.route('/acts-year', methods=['GET'])
def index():
    request_args = request.args.to_dict()
    name = request_args.get('name', None)
    year = request_args.get('year', None)
    if not name and not year:
        abort(400, 'No name and year provided')

    response = requests.get(f'http://api.sejm.gov.pl/eli/acts/{name}/{year}')
    result = json.loads(response.text)
    sort_by = request_args.get('sort_by', None)
    if sort_by:
        result['items'] = sorted(
            result['items'], key=lambda k: (sort_by not in k, k.get(sort_by, None), k['pos']),
            reverse=False
        )
    return result


@app.route('/acts-list', methods=['GET'])
def acts_list():
    response = requests.get('http://api.sejm.gov.pl/eli/acts')
    return {item['name']: item for item in json.loads(response.text)}


@app.route('/act-text', methods=['GET'])
def act_text():
    request_args = request.args.to_dict()
    name = request_args.get('name', None)
    year = request_args.get('year', None)
    pos = request_args.get('pos', None)
    if not name or not year or not pos:
        abort(400, 'Wrong data')

    html_response = requests.get(f'http://api.sejm.gov.pl/eli/acts/{name}/{year}/{pos}/text.html')
    html_act = html_response.text if '<!DOCTYPE HTML>' in html_response.text else None
    soup = ''
    if html_act:
        soup = BeautifulSoup(html_act, "html.parser")
        for a in soup.find_all('a', href=True):
            if 'text.html' in a['href']:
                new_href = a['href'].split('deeds')[1].split('/')[1:4]
                if len(new_href) == 3:
                    a['href'] = f'/act-text/DU/{new_href[1]}/{new_href[2]}'
                else:
                    a.name = 'p'
            else:
                a.name = 'p'
    url = f'http://api.sejm.gov.pl/eli/acts/{name}/{year}/{pos}/text.pdf'
    title_response = json.loads(requests.get(f'http://api.sejm.gov.pl/eli/acts/{name}/{year}/{pos}').text)

    result = {'data': {'url': url, 'html': html_act if not act_text else str(soup), 'title': title_response['title']}}
    return app.response_class(json.dumps(result, sort_keys=False), mimetype=app.config['JSONIFY_MIMETYPE'])


@app.route('/act-text-references', methods=['GET'])
def act_text_references():
    request_args = request.args.to_dict()
    name = request_args.get('name', None)
    year = request_args.get('year', None)
    pos = request_args.get('pos', None)
    if not name or not year or not pos:
        abort(400, 'Wrong data')

    url = f'http://api.sejm.gov.pl/eli/acts/{name}/{year}/{pos}/text.pdf'
    remote_file = urlopen(Request(url)).read()
    memory_file = io.BytesIO(remote_file)
    pdf_file = pdftotext.PDF(memory_file)
    references = {}
    # regex match
    regex = r'Dz.\sU.\sz.[0-9]{4}.r.\spoz.[,*\si*\s*[0-9]+]*'
    for idx, page in enumerate(pdf_file):
        regex_find = re.findall(regex, page)
        for result in regex_find:
            params = [x for x in result.replace(',', '').split() if x.isdigit()]
            for act_idx in params[1:]:
                act_path = f'DU/{params[0]}/{act_idx}'
                act_info = json.loads(requests.get(f'http://api.sejm.gov.pl/eli/acts/{act_path}').text)
                references.setdefault(idx, []).append({
                    'title': act_info['title'],
                    'id': act_path,
                })

    data = {'data': {'references': references}}
    return app.response_class(json.dumps(data, sort_keys=False), mimetype=app.config['JSONIFY_MIMETYPE'])


@app.route('/act-references', methods=['GET'])
def act_references():
    request_args = request.args.to_dict()
    name = request_args.get('name', None)
    year = request_args.get('year', None)
    pos = request_args.get('pos', None)
    if not name or not year or not pos:
        abort(400, 'Wrong data')

    references = json.loads(requests.get(f'http://api.sejm.gov.pl/eli/acts/{name}/{year}/{pos}').text)['references']
    for key, value in references.items():
        for act in value:
            act_id = act['id'].split('/')
            act_info = json.loads(requests.get(f'http://api.sejm.gov.pl/eli/acts/{act_id[0]}/{act_id[1]}/{act_id[2]}').text)
            act_list = list(act.items())
            act_list.insert(0, ('title', act_info['title']))
            act.clear()
            act.update(dict(act_list))
    result = {'data': {'references': references}}
    return app.response_class(json.dumps(result, sort_keys=False), mimetype=app.config['JSONIFY_MIMETYPE'])


@app.route('/act-title', methods=['GET'])
def act_title():
    request_args = request.args.to_dict()
    name = request_args.get('name', None)
    year = request_args.get('year', None)
    pos = request_args.get('pos', None)
    if not name or not year or not pos:
        abort(400, 'Wrong data')

    response = json.loads(requests.get(f'http://api.sejm.gov.pl/eli/acts/{name}/{year}/{pos}').text)
    return {'title': response['title']}
