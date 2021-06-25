import React,{ useState,useEffect } from 'react';
import classes from './ViewArticle.module.css'
import { withRouter } from 'react-router-dom'
import parse from 'html-react-parser'
import { Container } from 'reactstrap'
import firebase from '../../../src/Config/firebase'
const db = firebase.firestore()

const ViewArticle = (props) => {

    const [article,setArticle] = useState({})
    const [isLoaded,setIsLoaded] = useState(false)


    useEffect(() => {
        console.log(props)
        if( typeof props.location.state !== 'undefined'){
            if( props.location.state.hasOwnProperty('article')){
                setArticle({...props.location.state.article})
                setIsLoaded(true)
            }
        }else{
            getArticleByID(props.match.parms.id)
        }
    },[]);

    const getArticleByID = (aid) => {
        db.collection('Article')
            .doc(aid)
            .get()
            .then(doc => {
                if(doc.exist){
                    setArticle(doc.data())
                    setIsLoaded(true)
                }else{
                    props.history.path({pathname:'/'})
                }
            })
    }

    const timeStampToString = (ts) => {
        const date = new Date(ts *1000)
        return (date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate())
    }

    if(isLoaded){
        return(
            <Container>
                <div className={classes.Article}>
                    <div className={classes.ImageContainer}>
                        <img className={classes.Image}
                             src={article.featureimage}
                             alt={article.title}/>
                        <div className={classes.ArticleInfo}>
                            <h1 className={classes.Title}>
                                {article.title}
                            </h1>
                            <div className={classes.Date}>
                                {timeStampToString(article.lastModified.seconds)}
                            </div>
                        </div>
                    </div>
                    <div className={classes.ArticleMain}>
                        {parse(article.content)}
                    </div>
                </div>
            </Container>
        );
    }else{
        return(
             <div>
                is loading...
             </div>
        );
    }

}

export default withRouter(ViewArticle)