import { connect } from 'react-redux'
import {getIdea} from '../selectors/ideaSelectors'
import ShowIdea from '../components/ShowIdea.jsx'


//all this component does is format the data in the store so that it can be displayed more easily
const mapStateToProps = (state, ownProps) => {
  return {
    idea: getIdea(state, ownProps),
    id: ownProps.idea_id
  }
}

const ShowIdeaContainer = connect(
  mapStateToProps
)(ShowIdea)

export default ShowIdeaContainer