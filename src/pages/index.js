import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import ContactList from "../components/contact-list";

import "./index.css"

const IndexPage = () => (
  <Layout>
    <SEO title="Adam Christopher Miller | Frontend Software Engineer" />
    <section>
      <div className="section-wrapper">
        <h1>Adam Christopher Miller</h1>
        <h2>Software Engineer</h2>
        <p className="word-block">
          Heyo - My name's Adam Miller and I'm a Principal Software Engineer working at Walmart Labs. I'm focused on crafting great experiences on the web. I like to cook and can swing a hammer.
        </p>
        <ContactList />
      </div>
    </section>
  </Layout>
)

export default IndexPage
