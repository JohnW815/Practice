import React, { useState, useEffect } from 'react'
import { Container } from 'reactstrap'
import firebase from '../../../Config/firebase'

import ArticleCard from '../../../Component/ArticleCard/ArticleCard'

const db = firebase.firestore()

const Main = (props) => {

  const [isLoaded,setIsLoaded] = useState(false);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    getMyArticle()
  })

  const getMyArticle = () => {
    db
        .collection('Article')
        .limit(8)
        .get()
        .then( docs => {
            if(!docs.empty){
                let allArticle = []
                docs.forEach(function(doc) {
                    const article = {
                        id: doc.id,
                        ...doc.data()
                    }

                    allArticle.push(article)
                })

                setArticles(allArticle)
                setIsLoaded(true)

            }
        })
  }

    return(
      <div>
        <Container>
            {
                isLoaded?
                    articles.map((articles,index) => {
                        return(
                            <ArticleCard
                                key={index}
                                data={articles} />
                        )
                    })
                    : ''
            }
        </Container>
      </div>
    );
}

export default Main;