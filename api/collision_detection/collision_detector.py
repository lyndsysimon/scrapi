# This file will take an input (JSON) document, and find collision in the database
import sys
import os
import json
from fuzzywuzzy import fuzz
sys.path.insert(1, os.path.abspath(os.path.join(os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    os.pardir), os.pardir),
))
from website import search


def detect(doc):

    original_doc = open(doc, 'r')
    original_json = json.loads(original_doc.read())
    original_title = original_json['title']
    original_authors = []
    for author in original_json['contributors']:
        original_authors.append(author['full_name'])
    original_author_string = ','.join(original_authors)

    keyword = max(original_title.split(' '), key=len)
    for compare_doc in search.search('scrapi', str(keyword)):
        compare_title = compare_doc['title']
        title_ratio = fuzz.partial_ratio(original_title, compare_title)
        if title_ratio >= 80:
            compare_authors = []
            for author in compare_doc['contributors']:
                compare_authors.append(author['full_name'])
            compare_author_string = ','.join(compare_authors)
            author_ratio = fuzz.token_sort_ratio(original_author_string, compare_author_string)
            if author_ratio >= 70:
                print "COLLISION"
            else:
                print "NOT A COLLISION"
        else: 
            print "NOT A COLLISION"


detect('collision_test/PLoS/10.1371journal.pbio.0020137/2014-07-08 14:33:06.336347/parsed.json')


#TODO
# collect the search results into some kinda list
# from dat list see what search results have bigword in their title
# if bigword is in the title
    # check the whole title with fuzzy wuzzy to see if they are the same/close
        # check some other stuffz (author etc)
