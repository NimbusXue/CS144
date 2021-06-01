import java.security.MessageDigest;
import java.io.*;

public class MessageDigestExample {
   public static void main(String args[]) throws Exception{
      FileInputStream in = null;
      
       
      MessageDigest md = MessageDigest.getInstance("SHA-256");
      String filename=args[0];
      in = new FileInputStream(filename);
      int ch;
      String message="";
      while((ch=in.read())!=-1)
            message+=(char)ch;
      in.close();
      md.update(message.getBytes());
      

      byte[] digest = md.digest();      
    
      StringBuffer hexString = new StringBuffer();
      
      for (int i = 0;i<digest.length;i++) {
         String hex=Integer.toHexString(0xFF & digest[i]);
         if (hex.length()%2==1){
             hex="0"+hex;
         }
         hexString.append(hex);

      }
      System.out.println(hexString.toString());
         
   }
}