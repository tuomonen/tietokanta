import axios from 'axios'
const baseUrl = '/api/login'

const login = async credentials => {
  console.log('sisällä loginServicessä')
  const response = await axios.post(baseUrl, credentials)
  console.log(response.data)
  return response.data
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { login }