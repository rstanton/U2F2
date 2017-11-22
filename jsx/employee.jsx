const FIND_EMPLOYEE = "users/by_id_and_pin";
const DB = "FIDO";

class Employee extends React.Component{
    constructor(props){
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);

        this.init = this.init.bind(this);

        this.init();
    }

    init(){
        let db = new PouchDB(DB);

        var designDoc = {
            _id:'_design/users',
            views:{
                by_id_and_pin:{
                    map:function(doc){
                        if(doc.employeeID)
                            emit(doc.employeeID, doc);

                        if(doc.pin)
                            emit(doc.pin, doc);
                    }.toString()
                },
                all:{
                    map:function(doc) {
                        emit(doc);
                    }.toString()
                }
            }
        };

        db.put(designDoc, function(err, resp){
            if(err) {
                if (err.status != 409)
                    console.error(err);
            }
            else {
                console.log("Index for created.");
            }
        }.bind(this));
    }

    componentDidMount(){
        $("#logonDialog").dialog({
            title:"Logon",
            modal:"true",
            closeOnEscape:false,
            draggable: false
        });
    }

    handleSubmit(event){

        $("#logonDialog").dialog("close");
        $("#logonDialog").dialog("destroy");

        this.props.next();
    }

    render(){
        return <div id={"logonDialog"}><form action={"#"} onSubmit={this.handleSubmit}>
            <div className={"form-group"}>
                <label htmlFor={"employeeid"}>Employee ID</label>
                <input type={"text"} id={"employeeid"} placeholder={"Employee ID"} className={"form-control"} onChange={this.props.onEmployeeIDChange} value={this.props.employeeID}/>
            </div>
            <div className={"form-group"}>
                <label htmlFor={"password"}>PIN</label>
                <input type={"password"} id={"employeeid"} placeholder={"PIN"} value={this.props.pin} onChange={this.props.onPINChange} className={"form-control"}/>
            </div>
            <button type={"submit"} className={"btn btn-primary"}>Logon</button>
        </form></div>;
    }
}