### Google Assistant APP  

在此提供我所製作的Google Assistant BOT 背後執行的代碼  

Setup Instructions
----
1.Sign-up/Login to Google account  
2.Create a Firebase project  
3.Deploy the responses directory with Firebase hosting: 
4.Follow the instructions to set up and initialize Firebase SDK for Cloud Functions. Make sure to select the project that you have previously generated in the Actions on Google Console and to reply N when asked to overwrite existing files by the Firebase CLI.  
5.Run firebase deploy --only hosting and take note of the endpoint where the responses folder has been published. It should look like   Hosting URL: https://${PROJECTID}.firebaseapp.com  
6.Select the correct JSON file for your Dialogflow fulfillment and take a note of the URL of the file (e.g.   https://${PROJECTID}.firebaseapp.com/v2/ActionsOnGoogle/RichResponses/SimpleResponse.json)  
7.Go to the Dialogflow console and select Fulfillment from the left navigation menu.  
Enable Webhook > URL to the URL of the JSON file from the previous step, then select Save.  
8.Go to Intents from the left navigation menu and for every intent that you'd like to enable fulfillment for:  
9.Select the intent  
10.In Fulfillment > Enable Webhook call for this intent.  
  
額外需要：
-------
Action on Google：發布應用至Google Assistant  
DialogFlow：設計對話與處理回應  
Firebase：部屬Fulfillment  

詳細代碼說明與教學：  
-------
Action on Google官方說明：https://developers.google.com/actions/  
Dialogflow 官方說明：https://dialogflow.com/docs/getting-started  
Firebase 官方說明：https://firebase.google.com/docs  



