import java.io.*;
import java.security.MessageDigest;
public class ComputeSHA{
    public static void main(String[] args) throws Exception{
      FileInputStream in = null; 
      MessageDigest md = MessageDigest.getInstance("SHA-256");
      String filename=args[0];
      in = new FileInputStream(filename);
      long fileSize = new File(filename).length();
      byte[] allBytes = new byte[(int) fileSize];

      in.read(allBytes);
      // int ch;
      // String message="";
      // while((ch=in.read())!=-1)
      //       message+=(char)ch;

      in.close();

      md.update(allBytes);

      byte[] hash_value = md.digest(); 

      StringBuffer ans = new StringBuffer();

      for (int i = 0;i<hash_value.length;i++) {
         String hex=Integer.toHexString(0xFF & hash_value[i]);
         if (hex.length()%2==1){
             hex="0"+hex;
         }
         ans.append(hex);

      }

      System.out.println(ans.toString());
    }
}