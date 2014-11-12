function ImportCtrl ($scope, Airport) {
	$scope.svg = {};
	$scope.treedata = 
[
    { "label" : "User", "id" : "role1", "children" : [
        { "label" : "subUser1", "id" : "role11", "children" : [] },
        { "label" : "subUser2", "id" : "role12", "children" : [
            { "label" : "subUser2-1", "id" : "role121", "children" : [
                { "label" : "subUser2-1-1", "id" : "role1211", "children" : [] },
                { "label" : "subUser2-1-2", "id" : "role1212", "children" : [] }
            ]}
        ]}
    ]},
    { "label" : "Admin", "id" : "role2", "children" : [] },
    { "label" : "Guest", "id" : "role3", "children" : [] }
]; 

	console.log("yo");
};



