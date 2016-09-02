import pandas as pd
from bs4 import BeautifulSoup
import requests
import os

download_path = "C:\\cygwin64\\home\\eshavish\\node_modules\\twitter-api-node-express\\python_scripts\\pic\\"
num_of_img = 1
soup = ""

print ("Loading house data...")

house_urls = pd.read_csv("C:\\cygwin64\\home\\eshavish\\node_modules\\twitter-api-node-express\\python_scripts\\SanDiego_Housing_TextData13.csv")
image_fields = house_urls[["KEY", "R3"]]

print ("Downloading house images...")

for a in range(0, image_fields.shape[0] + 1):
    if not os.path.exists(download_path + image_fields["KEY"][a]):
        os.makedirs(download_path + image_fields["KEY"][a])

    print ("Downloading house ID: ", image_fields["KEY"][a])

    for j in range(0, 4):
        try:
            image_url = "https://ssl.cdn-redfin.com/photo/48/mbpadded/" + repr(image_fields["R3"][a]) + "/genMid."\
                        + image_fields["KEY"][a] + "_" + repr(j) + ".jpg"
            print (image_url)
            soup = BeautifulSoup(requests.get(image_url).content, "lxml")
            print ("beautiful soup")

            if str(soup.find_all("p")) != "[<p>Fatal Dirpy Error</p>]":
                f = open(download_path + image_fields["KEY"][a] + "\\" + repr(num_of_img) + ".jpg", 'wb')
                f.write(requests.get(image_url).content)
                f.close()

                num_of_img += 1

            print (num_of_img)

            for k in range(1, 50):
                image_url = "https://ssl.cdn-redfin.com/photo/48/mbpadded/" + repr(image_fields["R3"][a])\
                            + "/genMid." + image_fields["KEY"][a] + "_" + repr(k) + "_" + repr(j) + ".jpg"

                soup = BeautifulSoup(requests.get(image_url).content, "lxml")

                if str(soup.find_all("p")) != "[<p>Fatal Dirpy Error</p>]":
                    f = open(download_path + image_fields["KEY"][a] + "\\" + repr(num_of_img) + ".jpg", 'wb')
                    f.write(requests.get(image_url).content)
                    f.close()

                    num_of_img += 1
        except: pass

    num_of_img = 1