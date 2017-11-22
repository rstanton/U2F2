class Wrapper extends React.Component{
    constructor(props){
        super(props);

        this.postRegister = this.postRegister.bind(this);
        this.updateEmployeeID = this.updateEmployeeID.bind(this);
        this.pinChange = this.pinChange.bind(this);
        this.register = this.register.bind(this);

        this.state = {
            register:false,
            challenge:false,
            employeeID:"",
            pin: "",
            token:{}
        };
    }

    handleCreateEmployee(){
        console.log("Logon State:  "+JSON.stringify(this.state));

        let db = new PouchDB(DB);

        db.query(FIND_EMPLOYEE,{key: this.state.employeeID, key2:this.state.pin}, function(err,res){
            if(err){
                console.log(err);
            }
            else{
                if(res.rows.length==0){
                    console.log("No User Found. Going to Registration");
                    this.props.register();
                }
                else{
                    console.log("User Found. Requesting Challenge");
                    this.props.challenge();
                }
            }
        }.bind(this));
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

    postRegister(token){
        this.setState({
            register:false,
            token: token
        });

        console.log(JSON.stringify(this.state));
    }

    register(){
        this.setState({
            register:true
        });
    }

    render(){
        if(this.state.challenge) {
            return <Challenge/>;
        }
        else if(this.state.register){
            return <Register next={this.postRegister}/>;
        }
        else{
            return <Employee onEmployeeIDChange={this.updateEmployeeID} onPINChange={this.pinChange} pin={this.state.pin} employeeID={this.state.employeeID} next={this.register}/>;
        }
    }
}

ReactDOM.render(
    <Wrapper/>,
    document.getElementById("root")
);