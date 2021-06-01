<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%><%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %><!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Edit Post</title>
</head>
<body>
    <div><h1>Edit Post</h1></div>
    <form action="post" method="POST">
        <div>
            <button type="submit" name="action" value="save">Save</button>
            <button type="submit" name="action" value="list">Close</button>
            <button type="submit" name="action" value="preview">Preview</button>
            <button type="submit" name="action" value="delete">Delete</button>
        </div>
        <input type="hidden" name="username" id="username" value='${param.username}' />
        <input type="hidden" name="postid" id="postid" value='${param.postid}'  />
        <div>
            <label for="title">Title</label>
            <c:if test="${not empty param.title}">
                <input type="text" name="title" id="title"  value='${param.title}'>
            </c:if>
            <c:if test="${empty param.title}">
                <input type="text" name="title" id="title" value='${requestScope.title}'>
            </c:if>
        </div>
        <div>
            <label for="body">Body</label>
            <c:if test="${not empty param.body}">
                <textarea style="height: 20rem;" name="body" id="body">${param.body}</textarea>
            </c:if>
            <c:if test="${empty param.body}">
                <textarea style="height: 20rem;" name="body" id="body">${requestScope.body}</textarea>
            </c:if>
        </div>
    </form>
</body>
</html>
