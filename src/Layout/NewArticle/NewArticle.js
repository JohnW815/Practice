import React,{ useState, useRef } from 'react';
import classes from './NewArticle.module.css'
import { Container, Row, Col, Card,CardHeader, CardBody, FormGroup, Label, Input, Button } from 'reactstrap'

import ReactQuill, {Quill} from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const NewArticle = (props) => {

    const quillRef = useRef(null)

    const [article,setArticle] = useState({
                                       title: '',
                                       content: '',
                                       featureImage: '',
                                       createDate: new Date(),
                                       lastModified: new Date(),
                                       createUserID: '',
                                       isPublish: false
                                    })

    const modules = {
        toolbar: [
          [{ 'header': [1, 2, false] }],
          ['bold', 'italic', 'underline','strike', 'blockquote'],
          [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
          ['link', 'image'],
          ['clean']
        ],
    }

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
    ]

    const onChangeArticleTitle = (value) => {
          setArticle(article => ({...article, title: value}))
    }

    const onChangeArticleContent = (value) => {
          setArticle(article => ({...article, content:value}))
    }

    const onChangePublish = (val) => {
              setArticle(article => ({...article, isPublish: val === 'True'}))
    }

    return(
        <Container>
            <Row>
                <Col xl={9} lg={9} md={8} sm={12} xs={12}>
                    <h2 className={classes.SectionTitle}>New Article</h2>
                    <FormGroup>
                        <Label className={classes.Label}>Title</Label>
                        <Input type='text' name='articleTitle' id='articleTitle' placeholder=''
                           onChange={(e) => onChangeArticleTitle(e.target.value)}
                           value={article.title}
                        />
                    </FormGroup>
                    <FormGroup>
                        <ReactQuill
                            ref={quillRef}
                            value={article.content}
                            onChange={(e) => onChangeArticleContent(e)}
                            theme='snow'
                            modules={modules}
                            formats={formats}
                        />
                    </FormGroup>
                </Col>
                <Col xl={3} lg={3} md={4} sm={12} xs={12}>
                    <Card>
                        <CardHeader>
                            Article Setting
                        </CardHeader>
                        <CardBody>
                            <FormGroup>
                                <Label className={classes.Label}>Publish</Label>
                                <Input type='select' name='publish' id='publish'
                                    onChange={(e) => onChangePublish(e.target.value)}>
                                    <option>False</option>
                                    <option>True</option>
                                </Input>
                            </FormGroup>
                            <FormGroup>
                                <Button color='danger' onClick={(e) => console.log(article)}>
                                    Submit
                                </Button>
                            </FormGroup>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );

}

export default NewArticle