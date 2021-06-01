public class PostInfo {
    private String username = null, title = null, body = null,modified = null, created = null;
    private int postid = 0;

    PostInfo() {
    }

    PostInfo(String username, int postid, String title, String body, String modified, String created) {
        this.username = username;
        this.postid = postid;
        this.title = title;
        this.body = body;
        this.modified = modified;
        this.created = created;
    }

    public String GetUsername() {
        return username;
    }

    public int GetPostid() {
        return postid;
    }


    public String GetTitle() {
        return title;
    }


    public String GetBody() {
        return body;
    }

    public String GetCreated() {
        return created;
    }

    
    public String GetModified() {
        return modified;
    }

    
}
