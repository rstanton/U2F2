class Register extends React.Component{
    constructor(props){
        super(props);

        this.init = this.init.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);


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
        u2f.register("https://127.0.0.1:8081", [{version:"U2F_V2", challenge: "dG7vN-E440ZnJaKQ7Ynq8AemLHziJfKrBpIBi5OET_0"}], [],
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
    }

    render(){
        return <div id={"registerDialog"}>Insert Your Key<div id={"status"}></div></div>;
    }
}
