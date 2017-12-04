class Register extends React.Component{
    constructor(props){
        super(props);

        this.init = this.init.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.getChallenge = this.getChallenge.bind(this);

        this.state={
            done:false,
            token:{}
        }
    }

    componentDidMount(){
        $("#registerDialog").dialog({
            title:"New User Registration",
            modal:"true",
            closeOnEscape:false,
            draggable: false
        });

        this.init();
    }

    init(){
        $.get("http://127.0.0.1:9000/fido/challenge", function(data, status, x){
            console.log("Got Challenge Data: "+data);

            u2f.register("https://127.0.0.1:8081", [{version:"U2F_V2", challenge: data}], [],
                function(data){
                    if(data.errorCode) {
                        document.getElementById("status").innerHTML = JSON.stringify(data);
                        return;
                    }

                    $("#registerDialog").dialog("close");
                    $("#registerDialog").dialog("destroy");

                    this.props.next(data);

                }.bind(this)
            );
        }.bind(this));

    }

    getChallenge(next){
        $.get("http://localhost:9000/fido/challenge", function(data){
            console.log("Got "+data+" as challenge");
            
            this.setState({
                challenge: data
            });
            
            next();
        }.bind(this))
    }

    render(){
        return <div id={"registerDialog"}>Insert Your Key<div id={"status"}></div></div>;
    }
}
