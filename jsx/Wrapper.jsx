class Wrapper extends React.Component{
    constructor(props){
        super(props);

        this.postRegister = this.postRegister.bind(this);
        this.postChallenge = this.postChallenge.bind(this);

        this.updateEmployeeID = this.updateEmployeeID.bind(this);
        this.pinChange = this.pinChange.bind(this);
        this.findUser = this.findUser.bind(this);
        this.addUser = this.addUser.bind(this);

        this.state = {
            register:false,
            challenge:false,
            employeeID:"",
            pin: "",
            token:{}
        };
    }

    updateEmployeeID(event){
        this.setState({
            employeeID: event.target.value
        });
    }

    pinChange(event){
        this.setState({
            pin: event.target.value
        });
    }

    //@ToDo, needs to create user
    postRegister(token){
        this.setState({
            token: token
        });

        this.addUser();

        console.log(JSON.stringify(this.state));
    }

    postChallenge(data){
        console.log("Got "+JSON.stringify(data));
    }

    addUser(){
        let db = new PouchDB(DB);

        db.post(this.state, function(err, doc){
            if(err){
                console.log(err);
            }
            else{
                console.log("User Created "+JSON.stringify(doc));

                this.setState({
                    register:false,
                    challenge: true
                });
            }
        }.bind(this));
    }

    findUser(){
        let db = new PouchDB(DB);
        console.log("Finding if employee with id "+this.state.employeeID+" exists");

        db.query(FIND_EMPLOYEE,{key: this.state.employeeID}, function(err,res){
            if(err){
                console.log(err);
            }
            else{
                if(res.rows.length==0){
                    console.log("No User Found. Going to Registration");

                    this.setState({
                        register:true
                    });
                }
                else{
                    console.log("User Found. Requesting Challenge");

                    db.get(res.rows[0].id, function(err, doc){
                        if(!err) {
                            console.log("Got " + JSON.stringify(doc));
                            this.setState({
                                challenge: true,
                                token: doc.token,
                            });
                        }
                    }.bind(this));
                }
            }
        }.bind(this));

    }

    render(){
        if(this.state.challenge) {
            return <Challenge token={this.state.token} next={this.postChallenge}/>;
        }
        else if(this.state.register){
            return <Register next={this.postRegister}/>;
        }
        else{
            return <Employee onEmployeeIDChange={this.updateEmployeeID} onPINChange={this.pinChange} pin={this.state.pin} employeeID={this.state.employeeID} next={this.findUser}/>;
        }
    }
}

ReactDOM.render(
    <Wrapper/>,
    document.getElementById("root")
);