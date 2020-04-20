[<img src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Google_Assistant_logo.svg" width=100 height=100 />](https://assistant.google.com/intl/zh_tw/)

### Google Assistant APP  

在此提供我所製作的Google Assistant BOT 背後執行的代碼  
>Google助理是由Google所開發之智慧型個人助理，  
>在2018年10月16日於臺灣上線。其後在隔年三月開放台灣的第三方程式可以與其介接。  
>(即Action On Google平台)  
>在這裡成列的是我自行開發並發布的Google Assistant 程式  
>提供原始碼供參考  

登上Google台灣新聞稿
------
>新聞稿發布時間：2019年7月31日  
[Google臺灣 新聞稿連結](https://taiwan.googleblog.com/2019/07/google_31.html?m=1&fbclid=IwAR1pEfrGuM1E46B0lkbT_47vvfb7yBRI08eC_y3yT5ig0ihO5uI-xsi2UPU)
* [美食決定器](https://assistant.google.com/services/a/uid/00000058f29109ab?hl=zh_tw)
* [1A2B猜數](https://assistant.google.com/services/a/uid/000000b5033b5e97?hl=zh_tw)
* [燈謎大師](https://assistant.google.com/services/a/uid/00000046536e4ef2?hl=zh_tw)
* [大腦運動會](https://assistant.google.com/services/a/uid/000000603cba0b27?hl=zh_tw)

>新聞稿發布日期：2020年3月31日  
[Google臺灣 新聞稿連結](https://taiwan.googleblog.com/2020/03/tips-for-home-entertainment.html?fbclid=IwAR3S6u6NuAm8fCKOuRePjseSoDyMmnvgE16oYXs7Eafthw9IFFtfAB71Neo)
* [詞語接龍](https://assistant.google.com/services/a/uid/000000ca4e8b5d65?hl=zh_tw)

執行原理
-------
[<img src="https://developers.google.com/assistant/conversational/images/aog-user-query-to-fulfillment.png" />](https://developers.google.com/assistant/conversational/overview)

* Google助理：
** 為Google開發的智慧型個人助理
** 在第三方應用的角色是處理語音辨識及傳遞回應給使用者
* DialogFlow：
** 建構自然語言處理模型並訓練機器辨識使用者輸入的意圖(Intent)
** 並作為中介把資訊傳遞給Fulfillment
* Fulfillment：
** 將來自DialogFlow的資訊進行分析再回應給使用者
** 實作上是將Fulfillment部署到Firebase上，作為處理與回傳客製化回應的中介


官方說明頁面
-------
* [Action on Google官方說明](https://developers.google.com/actions/) 
* [Dialogflow 官方說明](https://dialogflow.com/docs/getting-started)
* [Firebase 官方說明](https://firebase.google.com/docs)



