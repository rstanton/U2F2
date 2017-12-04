class Challenge extends React.Component{
    constructor(props){
        super(props);

        this.init = this.init.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);

        this.state = {
            data: {},
            challenge: {}
        }
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
        console.log("Making Call to decode registration data");

        $.get("http://127.0.0.1:9000/fido/register/"+this.props.token.registrationData).then(function(data, status, xhr){
            console.log("Status: "+status+", "+JSON.stringify(data));

            this.setState({
                data: data
            });

            $.get("http://127.0.0.1:9000/fido/challenge").then(function(d, s, x){
                console.log("Status: "+s+", "+d);

                this.setState({
                    challenge: d
                });

                console.log("Attempting a sign request with "+this.state.challenge+" and "+this.state.data.keyHandle);

                u2f.sign("https://127.0.0.1:8081",  this.state.challenge, [{version:"U2F_V2", keyHandle:this.state.data.keyHandle}], function(data){
                    console.log(JSON.stringify(data));

                    if(data.errorCode) {
                        document.getElementById("status").innerHTML = JSON.stringify(data);
                        return;
                    }

                    //Finally... validate!
                    $.get("http://127.0.0.1:9000/fido/verify/"+this.state.challenge+"?key="+this.state.data.publicKey+"&signature="+data.signatureData, function(result,status, x){
                        if(status=="success") {
                            document.getElementById("status").innerHTML = "Success";
                        }
                        else {
                            document.getElementById("status").innerHTML = status;
                        }
                    }.bind(this));
                }.bind(this) ,20);
            }.bind(this));
        }.bind(this));



    }


    render(){
        return <div id={"challengeDialog"}>Insert Your Key<div id={"status"}></div></div>;
    }
}