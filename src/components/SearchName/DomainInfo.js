import React, { Fragment } from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import { adopt } from 'react-adopt'
import Loader from '../Loader'
import DomainItem from '../DomainItem/DomainItem'
import { GET_WEB3 } from '../../graphql/queries'
import { H2 } from '../Typography/Basic'
import { GET_FAVOURITES } from '../../graphql/queries'

const GET_DOMAIN_STATE = gql`
  query getDomainState @client {
    domainState {
      name
      revealDate
      registrationDate
      value
      highestBid
      state
      owner
    }

    web3 {
      accounts
    }
  }
`

export const DomainInfo = ({ domainState, isFavourite }) => {
  if (!domainState) return null

  return (
    <div>
      <DomainItem domain={domainState} isFavourite={isFavourite} />
    </div>
  )
}

const Composed = adopt({
  domainState: <Query query={GET_DOMAIN_STATE} fetchPolicy="no-cache" />,
  accounts: <Query query={GET_WEB3} />
})

const DomainInfoContainer = () => {
  return (
    <Composed>
      {({
        domainState: {
          data: { domainState, web3 },
          loading
        }
      }) => {
        return (
          <Query query={GET_FAVOURITES}>
            {({ data: { favourites } }) => (
              <Fragment>
                <H2>Top Level Domains</H2>
                {loading ? (
                  <Fragment>
                    <Loader />
                  </Fragment>
                ) : (
                  <DomainInfo
                    domainState={domainState}
                    isFavourite={
                      favourites.filter(
                        domain => domain.name === domainState.name
                      ).length > 0
                    }
                  />
                )}
              </Fragment>
            )}
          </Query>
        )
      }}
    </Composed>
  )
}

export default DomainInfoContainer
