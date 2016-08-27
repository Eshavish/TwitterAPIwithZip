import os
import csv
import urllib
from urlparse import urlparse

def get_raw_urls(csv_file):
    raw_urls = [ ]
    with open(csv_file, 'rb') as link_file:
        content = csv.reader(link_file)
        for link in content:
            if len(link) != 0:
                raw_urls.append(link[0])
    return raw_urls

def get_real_urls(raw_urls):
    real_urls = []
    for url in raw_urls:
        try:
            if "imgres?imgurl" in url:
                temp_url = urlparse(str(url))
                url = temp_url.query.split("&")[0].replace("imgurl=","")
                real_urls.append(url)
        except:
            a = 0
    return real_urls

def save_img(url_list, brand):
    counter = 0
    if not os.path.exists("./" + brand):
        os.mkdir("./"+brand)
    for url in url_list:
        try:
            urllib.urlretrieve(url, './' + brand + '/' + str(counter) + '.jpg')
            counter += 1
        except:
            a = 0
        print("Image+1," + str(counter) + " images have been saved.")
    return counter     


raw_urls = get_raw_urls('mustang-2016-0.csv')
real_urls = get_real_urls(raw_urls)
save_img(real_urls, 'mustang3')