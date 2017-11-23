class Challenge extends React.Component{
    constructor(props){
        super(props);

        this.init = this.init.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount(){
        $("#challengeDialog").dialog({
            title:"User Challenge",
            modal:"true",
            closeOnEscape:false,
            draggable: false
        });

        this.init();
    }

    init(){
        console.log("Making Sign Request with "+this.props.token.registrationData);

        this.decodeKey(this.props.token.registrationData);

        u2f.sign("https://127.0.0.1:8081",  this.props.token.challenge, [{version:"U2F_V2",keyHandle:this.props.token.registrationData}],
            function(data){
                console.log(JSON.stringify(data));

                if(data.errorCode) {
                    document.getElementById("status").innerHTML = JSON.stringify(data);
                    return;
                }

                $("#challengeDialog").dialog("close");
                $("#challengeDialog").dialog("destroy");

                this.props.next(data);

            }.bind(this)
        ,20);
    }

    decodeKey(data) {
        console.log("Data length: "+data.length);
        console.log(SafeEncode.decode(data));

    }


    render(){
        return <div id={"challengeDialog"}>Insert Your Key<div id={"status"}></div></div>;
    }
}