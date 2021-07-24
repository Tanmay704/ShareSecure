#SecureShare: Secure Image sharing.

Description : This is image sharing web app where Image sharing securely by generating key for image, to avoid misuse of image by sharing local copy.

Url : https://share-secure.herokuapp.com

Technology used : Node.js, Express, Mongoose, MongoDB




How to use : 
1. The person who wants to share image need to create account.
2. After creating account,click on Create room button,Enter the details and upload image, you can also limit how many max members can visit the room.
3. After creation room, one key will generate on dashboard you can give it to only the visiter who want to visit your room. if you wants to change a key, you can change by            visiting setting.
4. For visiting room visitor need to click on visit room and then need to aunthenticate with google, then put key of room which you want to visit.
5. The person who created room will have track of all visitors where he can see all the list of visitors and date,time which they visited.




How it work :
  1. When user upload image then it encrypted and then stored in database.
  2. When viewer access room where image is stored then the encrypted image is decrypted and viewer can see.

  
             
         
