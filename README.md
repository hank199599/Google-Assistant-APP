### Google Assistant APP  

在此提供我所製作的Google Assistant BOT 背後執行的代碼  

部屬教學  
----
[原始教學頁面](https://github.com/dialogflow/fulfillment-webhook-json#setup-instructions)  
+1. [註冊/登入](https://accounts.google.com/SignUp?hl=en) Google 帳號
2. [建立一個 Firebase專案](https://console.firebase.google.com/)
3. 使用[Firebase託管](https://firebase.google.com/docs/hosting/)部署`responses`目錄:
   + 按照說明[設置和初始化Firebase SDK for Cloud Functions](https://firebase.google.com/docs/functions/get-started#set_up_and_initialize_functions_sdk).   確保選擇之前在Google控制台上的操作中生成的項目，並在要求通過Firebase CLI覆蓋現有文件時回复“N”
   + 執行 `firebase deploy --only hosting` 並記下端點所在的位置 `responses` 資料夾已部屬。應該是這樣的`Hosting URL: https://${PROJECTID}.firebaseapp.com`
4. 為Dialogflow實現選擇正確的JSON文件，並記下該文件的URL (e.g. `https://${PROJECTID}.firebaseapp.com/v2/ActionsOnGoogle/RichResponses/SimpleResponse.json`)
5. 現在到Dialogflow控制台，並從左側導航菜單中選擇 **Fulfillment** 。
6. **Enable Webhook** > **URL** 到上一步的JSON文件的URL，然後選擇 **Save**.
7. 前往**Intents** 從左側導航菜單中，並建立您希望實現的意圖(Intent)，如'Default Welcome Intent'
    + 選擇欲在 **Fulfillment** 實現呼叫的意圖(Intent)，進入選單。然後將「Enable WebWook Call for this Intent」打開
    + 在 **Fulfillment** > **Enable Webhook** 之中輸入欲呼叫的意圖(Intent)，像是這樣：
         app.intent('Default Welcome Intent', (conv) => { 
         conv.ask('Hi,\n What can I do for you?');
         conv.ask(new Suggestions('GoodBye'));
          });  
    
額外需要的資源：
-------
Action on Google：發布應用至Google Assistant  
DialogFlow：設計對話與處理回應  
Firebase：部屬Fulfillment  

詳細代碼說明與教學：  
-------
Action on Google官方說明：https://developers.google.com/actions/  
Dialogflow 官方說明：https://dialogflow.com/docs/getting-started  
Firebase 官方說明：https://firebase.google.com/docs  



