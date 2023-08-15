import React, { useEffect, useState } from 'react';
import '../Styles/dashboard.css';
import Header from '../Components/header/header';
import { Card, Row, Col, Input, Table, List, Button, Popconfirm, InputNumber } from 'antd';
import { ApiService } from '../Service/api';
import toast, { Toaster } from 'react-hot-toast';

const { TextArea } = Input;
let notify = null;

function HomePage() {
  const columns = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Price £',
      dataIndex: 'price',
      key: 'price',
      render: text => <>£ {text}</>
    },
    {
      title: 'Disc',
      dataIndex: 'discount',
      key: 'discount',
      render: text => <p>{text * 100} %</p>
    },
    {
      title: 'Price £',
      dataIndex: 'finalPrice',
      key: 'finalPrice',
      render: (_, item) => (
        <>£ {(item.price * (1 - item.discount)).toFixed(2)}</>
      )
    },
    {
      title: 'Weight',
      dataIndex: 'weight',
      key: 'weight',
      render: text => <p>{text}</p>
    },
    {
      title: 'Action',
      dataIndex: 'id',
      key: 'id',
      render: (_, item) => (
        <>
          <a href={`/product/edit/${item.id}`}>Edit</a>
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(item.id)} className='ml-2'>
            <a>Delete</a>
          </Popconfirm>
        </>
      )
    },
  ];

  const [loggedUser, setLoggedUser] = useState({
    name: "",
    discount: ""
  });
  const [maingroups, setMaingroups] = useState([]);
  const [subgroupList, setSubgroupList] = useState([]);
  const [subgroups, setSubgroups] = useState([]);
  const [products, setProducts] = useState([]);
  const [results, setResults] = useState([]);
  const [note, setNote] = useState("");
  const [selectedMaingroup, setSelectedMaingroup] = useState("");
  const [selectedSubgroup, setSelectedSubgroup] = useState("");
  const [search, setSearch] = useState("");
  const [showSearchFlag, setShowSearchFlag] = useState(false);

  const handleMaingroupChange = (value) => {
    setSelectedSubgroup("");
    setNote("");
    setSelectedMaingroup(value);
    const selectedSubgroups = subgroupList.filter(item => item.mainGroup === value);
    setSubgroups(selectedSubgroups);
    getProducts(search, value, "");
  }

  const handleSubgroupChange = (value) => {
    setSelectedSubgroup(value);
    const subgroup = subgroupList.filter(item => item.id === value)[0];
    if (subgroup) {
      setNote(subgroup.notes);
    }
    getProducts(search, selectedMaingroup, value);
  }

  useEffect(() => {
    getSubgroups();
    getMaingroup();
    const user = JSON.parse(localStorage.getItem("@user"));
    setLoggedUser({
      name: user.name,
      discount: user.discount
    });
  }, [])

  const getMaingroup = () => {
    ApiService.getMaingroups().then(res => {
      if (res.status === 200) {
        if (res.data.data) {
          setMaingroups(res.data.data);
          const selectedSubgroups = subgroupList.filter(item => item.mainGroup === res.data.data[0].id);
          setSubgroups(selectedSubgroups);
        }
      }
    })
  }

  const getSubgroups = () => {
    ApiService.getSubgroups().then(res => {
      if (res.status === 200) {
        setSubgroupList(res.data.data);
        setSubgroups(res.data.data);
      }
    })
  }

  const getProducts = (search, main, sub) => {
    ApiService.getProducts(search, main, sub).then(res => {
      if (res.status === 200) {
        if (res.data.data) {
          const data = res.data.data.map((item, index) => {
            return {
              key: index,
              id: item.id,
              code: item.code,
              group: item.group,
              subgroup: item.subGroup,
              description: item.description,
              price: item.price,
              discount: item.maxDiscount,
              finalPrice: item.price,
              weight: item.weight
            };
          });
          var subList = groupBy(data, "subgroup");
          var result = [];
          for (var item in subList) {
            var temp = { [item]: subList[item] };
            result.push(temp);
          }
          setResults(result);
          setProducts(data);
        }
      }
    })
  }

  function groupBy(array, key) {
    return array
      .reduce((hash, obj) => {
        if (obj[key] === undefined) return hash;
        return Object.assign(hash, { [obj[key]]: (hash[obj[key]] || []).concat(obj) })
      }, {});
  }


  const handleSearch = (e) => {
    setSearch(e.target.value);
    getProducts(e.target.value, selectedMaingroup, selectedSubgroup);
  }

  const handleDelete = (id) => {
    ApiService.deleteProduct(id).then(res => {
      notify = null;
      if (res.status === 200) {
        toast(res.data.msg, {
          position: 'bottom-right',
          id: notify, // Custom Icon
          icon: '👏',
        });
        setTimeout(() => {
          notify = toast.dismiss();
          getProducts(search, selectedMaingroup, selectedSubgroup);
        }, 3000);
      } else {
        notify = toast.dismiss();
      }
    }).catch(err => {
      console.log(err);
      notify = toast.dismiss();
    })
  }

  const logout = () => {
    localStorage.clear();
    window.location.reload();
  }

  return (
    <div className="App">
      <div className='content'>
        <Toaster />
        <Card className='main-card'>
          <div>
            <div className="header-info">
              <h2>Product List</h2>
              <input type="button" className="logout-btn" onClick={() => logout()} value={"Logout"} />
            </div>
            <div className='account-info'>
              <div>
                <label>Username: {loggedUser.name}, </label>
              </div>
              <div className='account-info ml-2'>
                <label>Your Discount </label>
                <InputNumber
                  className='ml-2'
                  value={loggedUser.discount}
                  min={0}
                  max={100}
                  formatter={value => `${value}%`}
                  parser={value => value.replace('%', '')}
                />
              </div>
            </div>
          </div>
          <main className='mt-4'>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={24} md={10} lg={8}>
                <div>
                  <Card>
                    {showSearchFlag ?
                      <div>
                        <div>
                          <label>Search For Code or Description: </label>
                          <Input placeholder="Search..." value={search} onChange={(e) => handleSearch(e)} />
                          <div className='mt-4'></div>
                          <Row>
                            <Col span={24}>
                              <div className='textarea-title'>
                                <p>
                                  {search ?
                                    products.length + " Matches Found" :
                                    "Search Criteria"
                                  }
                                </p>
                              </div>
                              <TextArea
                                value={search ?
                                  products.length + " matches were found for " + search :
                                  "Please enter your search criteria in the Search For box. For best results please keep the search criteria short and avoid using plurals."
                                }
                                placeholder="Note"
                                className='border-top-radius-0'
                                autoSize={{
                                  minRows: 5,
                                  maxRows: 8,
                                }}
                              />
                            </Col>
                          </Row>
                          <Button block
                            onClick={() => {
                              setShowSearchFlag(!showSearchFlag);
                            }}
                            className='mt-4 press-btn'>
                            PRESS TO RETURN TO PRICE LIST
                          </Button>
                        </div>
                      </div> :
                      <div>
                        <Button block
                          onClick={() => {
                            setShowSearchFlag(!showSearchFlag);
                          }}
                          className='press-btn'>
                          PRESS TO SEARCH PRICE LIST
                        </Button>
                        <Row className='mt-4' type="flex" gutter={[16, 16]}>
                          <Col xs={24} sm={24} md={24} lg={12}>
                            <label>Main Group</label>
                            <List
                              bordered
                              dataSource={maingroups}
                              size='small'
                              className='list'
                              renderItem={(item) => (
                                <List.Item onClick={() => handleMaingroupChange(item.id)}
                                  className='cursor-pointer'>
                                  {item.name}
                                </List.Item>
                              )}
                            />
                          </Col>
                          <Col xs={24} sm={24} md={24} lg={12}>
                            <label>Sub Group</label>
                            <List
                              bordered
                              dataSource={subgroups}
                              size='small'
                              className='list'
                              renderItem={(item) => (
                                <List.Item onClick={() => handleSubgroupChange(item.id)}
                                  className='cursor-pointer'>
                                  {item.name}
                                </List.Item>
                              )}
                            />
                          </Col>
                        </Row>
                        <div className='mt-4'></div>
                        <Row>
                          <Col span={24}>
                            <TextArea
                              value={note}
                              onChange={(e) => setNote(e.target.value)}
                              placeholder="Note"
                              autoSize={{
                                minRows: 5,
                                maxRows: 8,
                              }}
                            />
                          </Col>
                        </Row>
                      </div>
                    }
                  </Card>
                </div>
              </Col>
              <Col xs={24} sm={24} md={14} lg={16}>
                <Card>
                  <div className='add-btn-box'>
                    <Button type="default" htmlType="button"
                      onClick={() => { window.location.href = '/product/add'; }}>
                      Add
                    </Button>
                  </div>
                  {/* <Table columns={columns} className='product-table mt-4' /> */}
                  <div className="custom-table mt-4">
                    <table>
                      <thead className='custom-table-header'>
                        <tr>
                          <th>Code</th>
                          <th>Description</th>
                          <th>Price £</th>
                          <th>Disc</th>
                          <th>Price £</th>
                          <th>Weight</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.map((item, index) => {
                          return <React.Fragment key={index}>
                            <tr>
                              <td></td>
                              <td className='td-description' colSpan="6">
                                <b>
                                  {subgroupList.filter((main) => main.id === Object.keys(item)[0]) &&
                                    subgroupList.filter((main) => main.id === parseInt(Object.keys(item)[0]))[0].name}
                                </b>
                              </td>
                            </tr>
                            {item[parseInt(Object.keys(item)[0])]?.map((subitem, subkey) => {
                              return (
                                <tr key={subkey + 1}>
                                  <td>{subitem.code}</td>
                                  <td className='td-description'>{subitem.description}</td>
                                  <td>£ {subitem.price}</td>
                                  <td>
                                    {loggedUser.discount > subitem.discount ?
                                      subitem.discount : loggedUser.discount
                                    }%
                                  </td>
                                  <td>
                                    £ {
                                      loggedUser.discount > subitem.discount ?
                                        (subitem.price * (1 - (subitem.discount / 100))).toFixed(2) :
                                        (subitem.price * (1 - (loggedUser.discount / 100))).toFixed(2)
                                    }
                                  </td>
                                  <td>{subitem.weight}</td>
                                  <td>
                                    <a href={`/product/edit/${subitem.id}`}>Edit</a>
                                    <Popconfirm title="Sure to delete?"
                                      onConfirm={() => handleDelete(subitem.id)} className='ml-2'>
                                      <a>Delete</a>
                                    </Popconfirm>
                                  </td>
                                </tr>
                              )
                            })}
                          </React.Fragment>
                        })}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </Col>
            </Row>
          </main>
        </Card>
      </div>
    </div>
  );
}

export default HomePage;