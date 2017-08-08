import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from "classnames";
import _map from 'lodash/map';

import $ from 'jquery';
import AvatarEditor from 'react-avatar-editor'

import { upload } from './apis';

import antd from 'antd';
const { Button, Icon, Row, Col, Card, InputNumber, Slider } = antd;

import './style/global.scss';
import './style/index.scss';

const fileImg= 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png';

class RcCut extends Component {
  constructor( props, context ) {
    super( props, context );
    this.state= {
      formID: 'g-core-upload-input-' + Math.floor(Math.random() * 10000),
      data: [],
      position: { x: 0.5, y: 0.5 },
      scale: 1,
      rotate: 0,
      borderRadius: 0,
      preview: null,
      width: 600,
      height: 600,
      show:false,
      rcState: false,
    };

    //react官方裁剪
    this.handleSave= this.handleSave.bind(this);

    this.handleScale= this.handleScale.bind(this);

    this.rotateLeft= this.rotateLeft.bind(this);

    this.rotateRight= this.rotateRight.bind(this);

    this.handleBorderRadius= this.handleBorderRadius.bind(this);

    this.handleXPosition= this.handleXPosition.bind(this);

    this.handleYPosition= this.handleYPosition.bind(this);

    this.handleWidth= this.handleWidth.bind(this);

    this.handleHeight= this.handleHeight.bind(this);

    this.logCallback= this.logCallback.bind(this);

    this.setEditorRef= this.setEditorRef.bind(this);

    this.handlePositionChange= this.handlePositionChange.bind(this);

    this.CancelOnClick= this.CancelOnClick.bind(this);

    this.resetFileInput= this.resetFileInput.bind(this);

    this.dataDelete= this.dataDelete.bind(this);



  }

  //react 官方裁剪

  //裁剪完成
  handleSave = (data) => {
    this.setState({
      rcState: true,
    });
    // this.setState({ show: false });
    const img = this.editor.getImageScaledToCanvas().toDataURL()
    let preview= {
      file: img,
      image: this.state.image,
      scale: this.state.scale,
      width: this.state.width,
      height: this.state.height,
      borderRadius: this.state.borderRadius
    }

    // debugger;

    upload({ file: preview.file },( data )=>{
        data.image= { name: preview.image.name };
        this.state.data.unshift(data);

        this.props.onChenge(this.state.data);
        this.resetFileInput(".rc_avatarEditor_file");
        this.setState({
          data: this.state.data,
          show: false,
          rcState: false,
        });
    });


  }


  handleScale = (e) => {
    this.setState({ scale: e })
  }

  rotateLeft = (e) => {
    e.preventDefault()

    this.setState({
      rotate: this.state.rotate - 90
    })
  }

  rotateRight = (e) => {
    e.preventDefault()
    this.setState({
      rotate: this.state.rotate + 90
    })
  }

  handleBorderRadius = (e) => {
    this.setState({ borderRadius: e })
  }

  handleXPosition = (e) => {
    this.setState({ position: { ...this.state.position,  x: e  } })
  }

  handleYPosition = (e) => {
    this.setState({ position: { ...this.state.position,  y: e  } })
  }

  handleWidth = (e) => {
    const width = parseInt(e.target.value)
    this.setState({ width })
  }

  handleHeight = (e) => {
    const height = parseInt(e.target.value)
    this.setState({ height })
  }

  logCallback (e) {
  }

  setEditorRef = (editor) => {
    if (editor) this.editor = editor
  }

  handlePositionChange = position => {
    this.setState({ position })
  }

  handleNewImage = (e) => {
    this.setState({ image: e.target.files[0],show: true });

  };

  //清楚 file 值
  resetFileInput(file){
     var obj = $("#"+this.state.formID+" "+file)[0];
     obj.value="";
  }

  CancelOnClick(){
    this.resetFileInput(".rc_avatarEditor_file");
    this.setState({ show: false })
  }

  dataDelete( index ){

    //删除起始下标为1，长度为1的一个值(len设置1，如果为0，则数组不变)
    this.state.data.splice(index,1);
    this.setState({
      data: this.state.data,
    })
    this.props.onChenge(this.state.data);
  }


  render() {
    return (
    <div className="rc_avatarEditor" id= { this.state.formID } >

        <label className="rc_avatarEditor_lable ant-btn" htmlFor={ this.state.formID+"rc_file" }><Icon className="rc_avatarEditor_lable_icon"  type="upload" /> 上传
          <input
            className="rc_avatarEditor_file"
            name='newImage'
            type='file'
            id={ this.state.formID+"rc_file" }
            onChange={this.handleNewImage}
          />
        </label>

      <div>
      {
        _map(this.state.data, ( item, index )=>{
          return (
            <Card  key={ `${index}card` }  >
              <Row type="flex" justify="space-between" align="middle" >
                <Col><p>{ item.image.name}</p></Col>
                <Col><Button onClick={ ()=>this.dataDelete(index) }>删除</Button></Col>
              </Row>
            </Card>
          )
        })
      }
      </div>
      <div className={ classNames( "rc_avatarEditor_box" ) } style={ {
          zIndex: this.state.show?999:-999,
          opacity: this.state.show?1:0,
        } } >
        <div className="rc_avatarEditor_box_con">
          <div className="rc_avatarEditor_box_con_left">
            <AvatarEditor
              ref={this.setEditorRef}
              scale={parseFloat(this.state.scale)}
              width={this.state.width}
              height={this.state.height}
              position={this.state.position}
              onPositionChange={this.handlePositionChange}
              rotate={parseFloat(this.state.rotate)}
              borderRadius={this.state.borderRadius}
              onSave={this.handleSave}
              onLoadFailure={this.logCallback.bind(this, 'onLoadFailed')}
              onLoadSuccess={this.logCallback.bind(this, 'onLoadSuccess')}
              onImageReady={this.logCallback.bind(this, 'onImageReady')}
              onImageLoad={this.logCallback.bind(this, 'onImageLoad')}
              onDropFile={this.logCallback.bind(this, 'onDropFile')}
              image={this.state.image || fileImg }
            />
          </div>
          <div className="rc_avatarEditor_box_con_right">
            缩放:
            <Row>
              <Col span={12}>
                <Slider min={1} max={4} onChange={this.handleScale} value={this.state.scale} step={0.01} />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={1}
                  max={4}
                  style={{ marginLeft: 16 }}
                  step={0.01}
                  value={this.state.scale}
                  onChange={this.handleScale}
                />
              </Col>
            </Row>
            <br />
            圆角:
            <Row>
              <Col span={12}>
                <Slider min={0} max={100} onChange={this.handleBorderRadius} value={this.state.borderRadius} step={1} />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={0}
                  max={100}
                  style={{ marginLeft: 16 }}
                  step={1}
                  value={this.state.borderRadius}
                  onChange={this.handleBorderRadius}
                />
              </Col>
            </Row>

            <br />
            X 位置:
            <Row>
              <Col span={12}>
                <Slider min={0} max={1} onChange={this.handleXPosition} value={this.state.position.x} step={0.01} />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={0}
                  max={1}
                  style={{ marginLeft: 16 }}
                  step={0.01}
                  value={this.state.position.x}
                  onChange={this.handleXPosition}
                />
              </Col>
            </Row>
            <br />
            Y 位置:
            <Row>
              <Col span={12}>
                <Slider min={0} max={1} onChange={this.handleYPosition} value={this.state.position.y} step={0.01} />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={0}
                  max={1}
                  style={{ marginLeft: 16 }}
                  step={0.01}
                  value={this.state.position.y}
                  onChange={this.handleYPosition}
                />
              </Col>
            </Row>
            <br />
            旋转:
            <Button onClick={this.rotateLeft}>向左</Button>
            <Button onClick={this.rotateRight}>向右</Button>
            <br />
            <br />
            <Button onClick={this.handleSave}>{ this.state.rcState?"裁剪中--请稍等...": "确定裁剪"}</Button>
              { this.state.rcState?"": <Button onClick={this.CancelOnClick}>取消裁剪</Button>}
            <br />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

RcCut.contextTypes = {
  router: PropTypes.object.isRequired
};

export default RcCut
