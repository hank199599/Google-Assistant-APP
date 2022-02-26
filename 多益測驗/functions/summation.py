import os
import json

new_dict = {}

with open('./summation_dict_new1.json',encoding="utf-8") as f:
        summation_dict = json.load(f)

# new_dict = summation_dict

# with open('./word_dict/word_dict_2.json',encoding="utf-8") as f:
#         old_dict = json.load(f)  


for item in summation_dict.keys():
    if len(summation_dict[item])==0:
        continue
    new_dict[item] = summation_dict[item]

with open('summation_dict_new3.json', 'w',encoding="utf-8") as f:
    json.dump(new_dict, f, ensure_ascii=False, indent=4)