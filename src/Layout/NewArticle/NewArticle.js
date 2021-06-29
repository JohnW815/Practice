import React,{ useState } from 'react';
import classes from './NewArticle.module.css'
import { Container, Row, Col, Card,CardHeader, CardBody, FormGroup, Label, Input, Button } from 'reactstrap'
import Compressor from 'compressorjs'

import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

import firebase from '../../Config/firebase'
import {v4 as uuidv4} from 'uuid'

const db = firebase.firestore()
const storageRef = firebase.storage()

const NewArticle = (props) => {

    const [article,setArticle] = useState({
                                       title: '',
                                       content: '',
                                       featureImage: '',
                                       createDate: new Date(),
                                       lastModified: new Date(),
                                       createUserID: '',
                                       isPublish: false
                                    })

    const quillRef = React.useRef(null);

    const [hasFeatureImage,setHasFeatureImage] = useState(false);

    const modules = {
        toolbar: [
          [{ 'header': [1, 2, false] }],
          ['bold', 'italic', 'underline','strike', 'blockquote'],
          [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
          ['link', {'image': () => quillImageCallBack()}],
          ['clean'],
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

    const submitArticle = () => {
        const newArticle = article;
        newArticle.createUserID = props.auth.uid;
        db.collection("Article")
            .add(article)
            .then(res => {
                console.log(res)
            })
            .catch(err => console.log(err))
    }

    const fileCompress = (file) => {
        return new Promise((resolve,reject) => {
            new Compressor(file,{
                file:'File',
                quality: 0.5,
                maxWidth: 640,
                maxHeight: 640,
                success(file){
                    return resolve({
                        success: true,
                        file: file
                    })
                },
                error(err){
                    return resolve({
                        success: false,
                        message: err.message
                    })
                }
            })
        })
    }

    const quillImageCallBack = () => {
        const input = document.createElement('input');
        input.setAttribute('type','file')
        input.setAttribute('accept','image/*')
        input.click()
        input.onchange = async () => {
            const file = input.files[0]
            const compressState = await fileCompress(file)
            if(compressState.success){
                console.log(compressState);
                const fileName = uuidv4();
                storageRef.ref().child("Article/" + fileName).put(compressState.file)
                    .then( async snapshot => {

                        const downloadURL = await storageRef.ref().child("Article/" + fileName).getDownloadURL();
                        let quill = quillRef.getEditor();
                        const range = quill.getSelection(true)
                        quill.insertEmbed(range.index, 'image', downloadURL)
                    })
            }
        }
    }

    const uploadImageCallBack = (e) => {
        return new Promise(async (resolve,reject) => {
            const file = e.target.files[0];
            const fileName = uuidv4();
            storageRef.ref().child("Article/" + fileName).put(file)
                .then( async snapshot => {

                    const downloadURL = await storageRef.ref().child("Article/" + fileName).getDownloadURL();
                    console.log(downloadURL)

                    resolve({
                        success:true,
                        data: {link:downloadURL}
                    })
                })
        })
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
                                <Label className={classes.Label}>Feature Image</Label>
                                <Input type='file' accept='image/*' className={classes.ImageUploader}
                                    onChange={async (e) => {
                                        const uploadState = await uploadImageCallBack(e);
                                        if(uploadState.success){
                                            setHasFeatureImage(true);
                                            setArticle(article => ({...article, featureImage: uploadState.data.link}))
                                        }
                                    }}
                                >
                                </Input>

                                {
                                    hasFeatureImage ?
                                        <img src={article.featureImage} alt="Your selection" className={classes.FeatureImg}/> : ''
                                }

                            </FormGroup>
                            <FormGroup>
                                <Button color='danger' onClick={(e) => submitArticle()}>
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