import os
import json

# with open('./toeic.json',encoding="utf-8") as f:
#         chinese_def = json.load(f) 

with open('./dict.json',encoding="utf-8") as f:
        phonetics = json.load(f) 

print(len(phonetics.keys()))

# for item in phonetics.keys():
#     try:
#         phonetics[item]["definition"] = chinese_def[item]
#     except:
#         continue

# with open('summation_new.json', 'w',encoding="utf-8") as f:
#     json.dump(phonetics, f, ensure_ascii=False, indent=4)