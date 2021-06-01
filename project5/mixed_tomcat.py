import sys, time, random
from locust import HttpUser, task, between

class MyUser(HttpUser):
    wait_time = between(0.5, 1)

    @task(8)
    def read_tomcat(self):
        postid = random.randint(1, 500)
        self.client.get("/editor/post?action=open&username=cs144&postid="+ str(postid), name="/editor/post?action=open")

    @task(2)
    def write_tomcat(self):
        postid = random.randint(1, 500)
        self.client.post("/editor/post?action=save&username=cs144&postid="+ str(postid)+"&title=Hello&body=***World!***", name="/editor/post?action=save")



  