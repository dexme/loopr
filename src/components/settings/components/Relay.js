import React from 'react';
import {connect} from 'dva';
import { Form,InputNumber,Button,Icon,Modal,Input,Radio,Select,Checkbox,Slider} from 'antd';
import ModalContainer from '../../../modules/modals/container'
import RelayAdd from './RelayAdd'
import RelayEdit from './RelayEdit'

const RealySettingForm = ({
    settings,form,modals
  }) => {
  const gotoEdit = (e)=>{
    e.preventDefault();
    modals.showModal({id:'settings/relay/edit'})
  }
  const gotoAdd = ()=>{
    modals.showModal({id:'settings/relay/add'})
  }

  function handleChange(type, value) {
    console.log(type+":"+value);
  }
  function handleSubmit() {
    form.validateFields((err,values) => {
      console.log('values',values);
      if(!err){
        // TODO
      }
    });
  }
  function handleReset() {
    form.resetFields()
  }
  function resetForm(){
    form.resetFields()
  }
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };


  return (
    <div className="" >
      <Form layout="horizontal" className="p15">
        <Form.Item label="Choose Relay" colon={false}>
          {form.getFieldDecorator('relay', {
            initialValue:2,
            rules:[]
          })(
            <Radio.Group className="">
              {
                [1,2,3].map((item,index)=>
                  <Radio className="d-flex align-items-center mb15 w-100" value={item} key={index}>
                    <div className="ml10">
                      <div className="row align-items-center no-gutters">
                        <div className="col-7 mr10">
                          <Input size="large" value="Default Loopring Relay"  />
                        </div>
                        <div className="col mr10">
                          <Input size="large" value="27.0.0.01" />
                        </div>
                        <div className="col-auto">
                          { index >0 &&
                            <a href="" onClick={gotoEdit} className="">Edit</a>
                          }
                        </div>
                      </div>
                    </div>
                  </Radio>
                )
              }
            </Radio.Group>
          )}
        </Form.Item>
        
      </Form>
      <div className="p15 zb-b-t text-right">
        <Button onClick={handleReset} type="" className="mr5">Reset</Button>
        <Button type="primary" onClick={gotoAdd} className="">Add Cutom Relay</Button>
      </div>
    </div>
  );
};


export default Form.create()(connect(({modals})=>(modals))(RealySettingForm));

