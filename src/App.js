import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'unistore/react'
import styled from 'styled-components'
import Fetch from 'react-fetch-component'
import Element from 'styled-genesis'

import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import CircularProgress from '@material-ui/core/CircularProgress'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button'

import { actions } from './state/store'

const thisYear = new Date().getFullYear()

const Wrapper = styled.div`
  background: #f2f2f2;
  color: #222;
  min-height: 100vh;
`
const Main = styled.main`
  max-width: 100rem;
  margin: 0 auto;
`
const ResponsiveMovie = styled.div`
  padding-top: ${props => props.videoHeight / props.videoWidth * 100}%;
  position: relative;
  & video,
  & iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`
const TableWrapper = styled.div`
  margin-left: -1rem;
  margin-right: -1rem;
  margin-top: -1rem;
  position: relative;
  margin-bottom: 2rem;
`
const SubTitle = styled.h2`
  font-size: 1.4rem;
  margin-bottom: 1rem;
`
const LoadingContainer = styled.div`
  padding: 2rem;
  text-align: center;
`
const NoWrap = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
const Logo = styled.img`
  display:block;
  margin: 0 auto;
  max-width: 40vw;
  height: auto;
`
const PartnerLogo = styled.img`
  display: inline-block;
  margin: 3vw;
  max-width: 14vw;
  height: auto;
`

class App extends Component {
  static propTypes = {
    tab: PropTypes.number,
    changeTab: PropTypes.func,
    liveYoutube: PropTypes.string,
    urlMen: PropTypes.string,
    urlWomen: PropTypes.string,
    map: PropTypes.string
  }
  render() {
    const {tab, changeTab, liveYoutube, chatId} = this.props
    return (
      <Wrapper>
        <Main>
          <Element p={1} bg='black'>
            <Logo src='https://nxtri.com/wp-content/uploads/2018/01/nxtri-logo.svg' />
          </Element>
          <ResponsiveMovie videoWidth={560} videoHeight={315}>
            {liveYoutube && <iframe src={liveYoutube} frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen title="Live-coverage for nxtri" />}
            {!liveYoutube && (
              <video playsInline muted loop autoPlay poster="poster.jpg">
                <source src="trailer.mp4" type="video/mp4" />
              </video>
            )}
          </ResponsiveMovie>
          <Paper>
            <Tabs
              value={tab}
              indicatorColor="primary"
              textColor="primary"
              onChange={changeTab}
              centered
            >
              <Tab label="Leaderboard" />
              <Tab label="Map" />
              {chatId && <Tab label="Livechat" />}
            </Tabs>
          </Paper>
          <Element p={1}>
            {this.renderTabContent()}
          </Element>
          <Element p={1} center>
            {this.renderDetailButtons()}
          </Element>
          <Element p={1} center>
            {this.renderShareLinks()}
          </Element>
          <Element pt={1} pb={1} center bg='black'>
            {this.renderPartners()}
          </Element>
          <Element p={1} center style={{fontSize: '0.8rem'}} color='#999'>
            Nxtri © {thisYear}
          </Element>
        </Main>
      </Wrapper>
    )
  }
  renderShareLinks() {
    const {shareLinks} = this.props
    return (
      <div>
        {shareLinks && shareLinks.map(({name, href}, i) => <Button key={i} color="secondary" href={href} target='_blank'>{name}</Button>)}
      </div>
    )
  }
  renderPartners() {
    const {partners} = this.props
    return (
      <div>
        {partners && partners.map(({name, img}, i) => <PartnerLogo key={i} src={img} alt={`Logo for ${name}`} />)}
      </div>
    )
  }
  renderTabContent() {
    const {tab} = this.props
    switch (tab) {
      case 1:
        return this.renderMap()
      case 2:
        return this.renderTweets()
      default:
        return this.renderLeaderBoard()
    }
  }
  renderDetailButtons() {
    const {map, raceInfoUrl} = this.props
    return (
      <div>
        <Button href={map} variant="contained" color="primary" style={{textTransform: 'none', marginBottom: 10}} target='_blank'>
          Open map in new window
        </Button>{' '}
        <Button href={raceInfoUrl} variant="contained" color="primary" style={{textTransform: 'none', marginBottom: 10}} target='_blank'>
          Results & athlete-search
        </Button>
      </div>
    )
  }
  renderMap() {
    const {map} = this.props
    return (
      <ResponsiveMovie videoHeight={550} videoWidth={650}>
        <iframe src={map} allowFullScreen title='Map of athletes' />
      </ResponsiveMovie>
    )
  }
  renderLeaderBoard() {
    const {urlMen, urlWomen} = this.props
    return (
      <div>
        <SubTitle>Leaderbord men</SubTitle>
        <Fetch url={urlMen}>
          { this.renderTableContent }
        </Fetch>
        <SubTitle>Leaderbord women</SubTitle>
        <Fetch url={urlWomen}>
          { this.renderTableContent }
        </Fetch>
      </div>
    )
  }
  renderTableContent = ({loading, error, data: rawData}) => {
    const data = rawData ? JSON.parse(rawData) : null
    if (loading) {
      return (
        <LoadingContainer>
          <CircularProgress color="secondary" />
        </LoadingContainer>
      )
    }
    if (error) {
      return (
        <SnackbarContent message={`Error: ${error.message}`} />
      )
    }
    if (data && data.data && !!data.data.length) {
      return (
        <TableWrapper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding='dense'><NoWrap>Name</NoWrap></TableCell>
                <TableCell padding='dense' numeric><NoWrap>Gap</NoWrap></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.data.map((item, i) => {
                return (
                  <TableRow key={i}>
                    <TableCell padding='dense'>{item[1]} {item[2]} ({item[4]}) {item[3]}</TableCell>
                    <TableCell padding='dense' numeric><NoWrap>{item[6]}</NoWrap></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableWrapper>
      )
    }
    return (
      <p style={{marginBottom: 10}}>No data yet</p>
    )
  }
  renderTweets() {
    const {chatId} = this.props
    return chatId ? (
       <ChatScript chatId={chatId} />
    ) : null
  }
}

class ChatScript extends Component {
  shouldComponentUpdate() {
    return false
  }
  componentDidMount() {
    (function(w, d, t, j, b, n) {
      function m() {
        var s = d.createElement(t);
        s.src = j;
        d.body.appendChild(s);
      }
      function c() {
        if (!w[n]) {
          var p = d.createElement(t);
          p.src = b;
          p.onload = m;
          d.body.appendChild(p);
        } else {
          m();
        }
      }
      c()
    }
    )(window, document, 'script', 'https://cdn.24liveblog.com/live-js/js/24.js', 'https://cdn.24liveblog.com/polyfill.min.js', '_babelPolyfill');
  }
  render() {
    const {chatId} = this.props
    const html = `<div id="LB24_LIVE_CONTENT" data-url="https://embed.24liveblog.com/" data-eid="${chatId}"></div>`
    return (
      <Element pt={1}>
        <div
          dangerouslySetInnerHTML={{
            __html: html
          }}
        />
      </Element>
    )
  }
}

export default connect(
  state => ({
    ...state
  }),
  actions
)(App)
