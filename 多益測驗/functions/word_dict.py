import os
import json
yourPath = './defination'
allFileList = os.listdir(yourPath)
summation = {}

list=[ file.replace('.json','') for file in allFileList]

# print(list)
i = 0
for word in list:
    i=i+1
    print(word)
    temp = {}
    with open('./defination/'+word+'.json',encoding="utf-8") as f:
        data = json.load(f) 
    # print(data['meanings'][0])
    if len(data['phonetics'])>0 and data['phonetics'][0].get('text') is not None :
        temp["phonetics"]=data['phonetics'][0]['text']
    elif len(data['phonetics'])>2 and data['phonetics'][1].get('text') is not None :
        temp["phonetics"]=data['phonetics'][1]['text']
    
    if len(data['meanings'])>0: temp["meanings"]=data['meanings'][0]['definitions'][0]['definition']
    summation[word] = temp
    # if word == "abide":break
# print(summation)

with open('summation.json', 'w',encoding="utf-8") as f:
    json.dump(summation, f, ensure_ascii=False, indent=4)