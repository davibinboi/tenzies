
export default function Die(props) {
    const style = {
        backgroundColor: props.isHeld ? '#ABF7B1' : 'white',
    }
    return (
        <h1 
        style={style} 
        className="die"
        onClick={props.changeColor}>{props.value}</h1>
    );
}