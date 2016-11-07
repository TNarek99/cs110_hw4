const searchText = $('#todo-search').val();

const renderTodos = function() {
    $.ajax({
        url: "/todos",
        type: 'get',
        dataType: 'json',
        data: {
            searchtext: searchText
        },

        success: function(data) {
            $('#todos-list').html("");
            data.items.forEach(function (item) {
                $li = $('<li id="'+item.id+'">' + item.message + '</li>');
                if (item.completed == true) {
                    $checkbox = $('<input type="checkbox" value="' + item.completed + '" checked>');
                } else {
                    $checkbox = $('<input type="checkbox" value="' + item.completed + '">');
                }
                $deleteButton = $('<button id="delete'+item.id+'">' + 'Delete</button>');

                $checkbox.change(function(){
                    updateTodo(item);
                });

                $deleteButton.click(function () {
                    deleteTodo(item.id)
                });

                $li.append($checkbox);
                $li.append($deleteButton);
                $('#todos-list').append($li);
            });
        },

        error: function(data) {
            alert('Error searching');
        }
    });
};

renderTodos();

const updateTodo = function(todo) {
    if (todo.completed == false) {
        todo.completed = true;
    } else {
        todo.completed = false;
    }

    $.ajax({
        url         : "/todos/" + todo.id,
        type        : 'put',
        dataType    : 'json',
        data        : JSON.stringify(todo),
        contentType : "application/json; charset=utf-8",
        success     : function(data) {

        },
        error       : function(data) {
            alert('Error updating todo');
        }
    });
};

$("#todo-save-button").click(function () {
    if ($("#todo-save").val()) {
        const value = $("#todo-save").val();
        $("#todo-save").val("");

        $.ajax({
            url         : "/todos",
            type        : 'post',
            dataType    : 'json',
            data        : JSON.stringify({
                message   : value,
                completed : false
            }),
            contentType : "application/json; charset=utf-8",
            success     : function(data) {
                renderTodos();
            },
            error       : function(data) {
                alert('Error creating Todo');
            }
        });

    }
});

$("#todo-search-button").click(function () {
    if ($("#todo-search").val()) {
        const searchText = $("#todo-search").val();
        $("#todo-search").val("");

        $.ajax({
            url      : "/todos",
            type     : 'get',
            dataType : 'json',
            data     : {
                searchtext : searchText
            },
            success  : function(data) {
                $('#todos-list').html("");
                data.items.forEach(function (item) {
                    $li = $('<li id="'+item.id+'">' + item.message + '</li>');
                    if (item.completed == true) {
                        $checkbox = $('<input type="checkbox" value="' + item.completed + '" checked>');
                    } else {
                        $checkbox = $('<input type="checkbox" value="' + item.completed + '">');
                    }
                    $deleteButton = $('<button id="delete'+item.id+'">' + 'Delete</button>');

                    $checkbox.change(function(){
                        updateTodo(item);
                    });

                    $deleteButton.click(function () {
                        deleteTodo(item.id)
                    });

                    $li.append($checkbox);
                    $li.append($deleteButton);
                    $('#todos-list').append($li);
                });
            },
            error    : function(data) {
                alert('Error searching');
            }
        });
    }
});

const deleteTodo = function(id) {
    $.ajax({
        url     : "/todos/" + id,
        type    : 'delete',
        success : function(data) {
            renderTodos();
        },
        error   : function(data) {
            alert('Error deleting the item');
        }
    });
};

const saveTodo = function (message){
    $.ajax({
        url: "/todos",
        type: 'get',
        dataType: 'json',
        data: {
            searchtext: searchText
        },

        success: function(data) {

            data.items.forEach(function (item) {
                const li = $('<li>' + item.message + '<input type="checkbox" checked="' + item.completed + '">' + '</li>');
                const deleteButton = $('<button id="delete'+item.id+'">' + 'Delete</button>');
                li.append(deleteButton);
                $('#todos-list').append(li);
            });
        },

        error: function(data) {
            alert('Error searching');
        }
    });
};

$("#show-all").click(function () {
    renderTodos();
});