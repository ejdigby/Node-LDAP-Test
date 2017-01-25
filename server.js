var LDAP = require('ldap-client');

//Username and password to authenticate
sessionUsername = "ejdigby"
sessionPassword = "Pass123456"

var ldap = new LDAP({
    uri:             'ldap://192.168.0.23',   // string
    validatecert:    false,             // Verify server certificate
    connecttimeout:  40,                // seconds, default is -1 (infinite timeout), connect timeout
    version:3,
    base:            'dc=ejdigby,dc=com',          // default base for all future searches
    attrs:           '*',               // default attribute list for future searches
    scope:           LDAP.SUBTREE,      // default scope for all future searches
    connect:          function(){},
    disconnect:      function(){},        // optional function to call when disconnect occurs        
}, function(err) {
    throw err
});


//Bind Using admin credentials
ldap.bind({
    binddn: 'cn=Administrator,cn=Users,dc=ejdigby,dc=com',
    password: 'Topsecretpassword'
}, function(err, data) {
    if (err) {
       console.log(err)
    } else {
        console.log("Connected")

        //Setup search request
        ldap.search( {
          base: 'cn=Users,dc=ejdigby,dc=com', //Base for Search
          scope: LDAP.SUBTREE, //Search Scope
          filter: "cn="+sessionUsername, //Search for sessionUsername
          attrs:"dn cn" // Request DN and CN
        }, function(err, data) {
            if (err) {
                 console.log(err)
                 console.log("No user with that username")
            } else {
                console.log("User Exists!")
                console.log(data[0]["dn"])
                dn = data[0]["dn"]
                cn = data[0]["cn"]
                checkuser(dn, cn)
            }
        })
    }
});

//Check credentials of user
checkuser = function(dn, cn){
    var userClient = ldap.bind({
        binddn: dn,
        password: password
    }, function(err) {
        if (err == null){
            var sessionId = cn
            console.log("Logged In!")
            console.log("Session Id " + sessionId)
        } else {
            console.log(err.message)
        }
    })
}