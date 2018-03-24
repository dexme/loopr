import React from 'react';
import {Button, Card, Form, Input, message, Modal, Select} from 'antd';
import {generateBindAddressTx, getBindAddress} from "Loopring/ethereum/utils";
import {notifyTransactionSubmitted} from 'Loopring/relay/utils'
import {connect} from 'dva';
import {projects} from "../../../common/config/data";
import {toHex} from "Loopring/common/formatter";
import intl from 'react-intl-universal';
import map from 'async/map';

class Airdrop extends React.Component {

  state = {
    address: null,
    project: null,
    projects
  };

  componentDidMount() {
    map(projects, async (project) => {
      const address = await getBindAddress(window.WALLET.getAddress(), project.projectId).then(res => {
        if (!res.error) {
          return res.result;
        }
      });
      return {...project, address}
    }, function (err, results) {
      if (!err) {
        this.setState({projects: results})
      }
    }.bind(this))

  }

  findBindAddress = (project) =>{
    return projects.find(project => project.projectId === project.projectId)
  };

  showConfirm = (address, project) => {
    const _this = this;
    Modal.confirm({
      title: intl.get('wallet.bind_address_confirm', {project: project.name.toUpperCase(), address}),
      onOk: async () => {
        const {tradingConfig, modal} = _this.props;
        const {project, address} = _this.state;
        const nonce = await window.STORAGE.wallet.getNonce(window.WALLET.getAddress());
        const tx = generateBindAddressTx({
          projectId: project.projectId,
          address,
          gasPrice: toHex(tradingConfig.gasPrice * 1e9),
          nonce: toHex(nonce)
        });
        window.WALLET.sendTransaction(tx).then(response => {
          if (!response.error) {
            message.error(response.error.message)
          } else {
            message.info('bind success');
            //    window.STORAGE.transactions.addTx({hash: response.result, owner: window.WALLET.getAddress()});
            window.STORAGE.wallet.setWallet({address: window.WALLET.getAddress(), nonce: tx.nonce});
            notifyTransactionSubmitted(response.result);
            _this.setState({address: null, project: null});
            modal.hideModal({id: 'wallet/airdrop'});
          }
        });
      },
      onCancel() {
      },
      okText: intl.get('order.yes'),
      cancelText: intl.get('order.no'),

    });
  };

  projectChange = (value) => {
    const project = window.CONFIG.getProjectById(value)
    if (project) {
      this.setState({project})
    } else {
      message.error('invalid type of project')
    }
  };
  addressChange = (e) => {
    this.setState({address: e.target.value})
  };

  render() {
    const options = projects.map(project => <Select.Option value={project.projectId}
                                                           key={project.projectId}>{project.lrx.toUpperCase()} (
      for {project.name.toUpperCase()} )</Select.Option>)
    const {project, address, projects} = this.state;
    return (
      <Card title={intl.get('wallet.bind_tip')}>
        <Form>
          <Form.Item label={intl.get('wallet.bind_type')}>
            <Select
              showSearch
              size="large"
              placeholder={intl.get('wallet.type_tip')}
              onChange={this.projectChange}
            >
              {options}
            </Select>
          </Form.Item>
          <Form.Item label={intl.get('wallet.address')}>
            <Input
              size="large"
              placeholder={intl.get('wallet.address_tip')}
              onChange={this.addressChange}
              value={address}
            />
          </Form.Item>
          {project && this.findBindAddress(project) && this.findBindAddress(project).address &&
          <Form.Item label={intl.get('wallet.address')}>
            <Input
              size="large"
              value={project && this.findBindAddress(project) && this.findBindAddress(project).address}
              disabled
            />
          </Form.Item>}
        </Form>
        <div className="mb25"></div>
        <Button onClick={this.showConfirm.bind(this, this.state.address, this.state.project)}
                className="w-100 d-block mt15" type="primary" size="large" disabled={!project || !address}>
          {intl.get('wallet.bind_address')}
        </Button>
      </Card>
    );
  }
}

function mapStateToProps(state) {
  return {
    tradingConfig: state.settings.trading,
    account: state.account
  };
}

export default connect(mapStateToProps)(Airdrop)

