<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%><%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %><!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Preview Post</title>
</head>
<body>
    <div>
        <form action="post" method="POST">
            <input type="hidden" name="username" value="${param.username}">
            <input type="hidden" name="postid" value="${param.postid}">
            <input type="hidden" name="title" value="${param.title}">
            <input type="hidden" name="body" value="${param.body}">
            <button type="submit" name="action" value="open">Close Preview</button>    
        </form>
    </div>
    <div>
        <h1 id="title">${requestScope.preview_t}</h1>
        <div id="body">${requestScope.preview_b}</div>
    </div>
    
</body>
</html>
