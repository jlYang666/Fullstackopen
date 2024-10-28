import './notification.css'

const Notification = ( { notification, notificationType } ) => {
  if (notification === null) {
    return null
  }

  return (
    <div className={notificationType}>
      {notification}
    </div>
  )
}

export default Notification