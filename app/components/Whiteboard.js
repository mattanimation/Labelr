import React, { Component } from "react";
import { Container, Row, Col, Button, Input } from 'reactstrap';
import { SketchField, Tools } from 'react-sketch';

import { FaMousePointer, FaPen, FaCircle, FaSquare, FaTrash } from 'react-icons/fa';

import shortid from 'shortid';


class WhiteboardScreen extends Component {
 
  state = {
    text: '',
    tool: Tools.Pencil
  }

  constructor(props) {
    super(props);

    this.tools = [
      {
        name: 'select',
        icon: <FaMousePointer />,
        tool: Tools.Select
      },
      {
        name: 'pencil', 
        icon: <FaPen />,
        tool: Tools.Pencil
      },
      {
        name: 'rect',
        icon: <FaSquare />,
        tool: Tools.Rectangle
      },
      {
        name: 'circle',
        icon: <FaCircle />,
        tool: Tools.Circle
      }
    ];

    this.auto_create_tools = ['circle', 'rect'];

    this.initial_objects = {
      'circle': { radius: 75, fill: 'transparent', stroke: '#000', strokeWidth: 3, top: 60, left: 500 },
      'rect': { width: 100, height: 50, fill: 'transparent', stroke: '#000', strokeWidth: 3, top: 100, left: 330 },
    }
  }


  async componentDidMount() {

    const { navigation } = this.props;

  }


  render() {
    return (
      <Container fluid>
        <Row>
          <Col lg={9}>
            {
              <SketchField
                className="canvas"
                ref={c => (this._sketch = c)}
                width='1024px'
                height='768px'
                tool={this.state.tool}
                lineColor='black'
                lineWidth={3}
                onUpdate={this.sketchUpdated}
                username="user"
                shortid={shortid} />
            }
          </Col>

          <Col lg={3} className="Sidebar">
            <div className="tools">

              {this.renderTools()}

              <div className="tool">
                <Button 
                  color="danger" 
                  size="lg" 
                  onClick={this.removeSelected} 
                >
                  <FaTrash />
                </Button>
              </div>
            </div>
            
            <div>
              <div className="textInputContainer">
                <Input 
                  type="textarea" 
                  name="text_to_add" 
                  id="text_to_add" 
                  placeholder="Enter text here" 
                  value={this.state.text}
                  onChange={this.onUpdateText} />
                <div className="buttonContainer">
                  <Button type="button" color="primary" onClick={this.addText} block>Add Text</Button>
                </div>
              </div>
            </div>

          </Col>  
        </Row>
      </Container>
    );
  }

  onUpdateText = (event) => {
    this.setState({
      text: event.target.value
    });
  }
  
  // 

  addText = () => {
    if(this.state.text){
      const id = shortid.generate();
      this._sketch.addText(this.state.text, { id }); 
    
      this.setState({
        text: ''
      });
    }
  }

  //

  pickTool = (event) => {
    const button = event.target.closest('button');
    const tool = button.getAttribute('data-tool');
    const tool_name = button.getAttribute('data-name');

    this.setState({
      tool
    }, () => {
      if(this.auto_create_tools.indexOf(tool_name) !== -1){
       
        const obj = this.initial_objects[tool_name];
        const id = shortid.generate();
        Object.assign(obj, { id: id, type: tool_name });
        
        this._sketch.addObject(JSON.stringify(obj)); 
      
        setTimeout(() => {
          this.setState({
            tool: Tools.Select 
          });
        }, 500);

      }

    });
  }


  renderTools = () => {
    return this.tools.map((tool) => {
      return (
        <div className="tool" key={tool.name}>
          <Button 
            color="secondary" 
            size="lg" 
            onClick={this.pickTool} 
            data-name={tool.name}
            data-tool={tool.tool}
          >
            {tool.icon}
          </Button>
        </div>
      );
    });
  }

  sketchUpdated = (obj, action, sender, id = null) => {
    //TODO
    console.log(obj, action, sender);
  }


  removeSelected = () => {
    const activeObj = this._sketch.getSelected();
    console.log(activeObj);
    this._sketch.removeSelected();
  }


}

export default WhiteboardScreen;