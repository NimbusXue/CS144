<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%><%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %><!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Post List</title>
</head>
<body>
    <div>
        <form action="post" id="0" method="POST">
            <input type="hidden" name="username" value="${param.username}">
            <input type="hidden" name="postid" value="0">
            <input type="hidden" name="title" value="">
            <input type="hidden" name="body" value="">
            <button type="submit" name="action" value="open">New Post</button></a>
        </form>
    </div>
    <table>
        <thead>
          <tr>
            <th>Title</th> <th>Created</th> <th>Modified</th> <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <c:forEach var="info" items="${posts}"  varStatus="status">
                <form id="${status.count}" action="post" method="POST">
                    <input type="hidden" name="username" value="${info.GetUsername()}"> 
                    <input type="hidden" name="postid" value="${info.GetPostid()}">
                    <tr>
                        <td>${info.GetTitle()}</td>
                        <td>${info.GetCreated()}</td>
                        <td>${info.GetModified()}</td>
                        <td>
                            <button type="submit" name="action" value="open">Open</button>
                            <button type="submit" name="action" value="delete">Delete</button>
                        </td>
                    </tr>
                </form>   
            </c:forEach>
        </tbody>
      </table>
</body>
</html>
