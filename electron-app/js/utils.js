const responseMessage = (success, res) => {
  if (success) {
    return { success: true, data: res }
  }
  return { success: false, message: res.message }
}

module.exports = {
  responseMessage
}
