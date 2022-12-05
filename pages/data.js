import React, {useEffect} from "react"
import axios from "axios"

const Data = () => {

    axios.get("https://api.getform.io/v1/forms/70755d8f-1e45-4823-b520-d86dbbe6930f?token=su2fFZ8h9xRyAbL1FCyznr0G78ned6lQbqPlWt8aNK2l2dXwRFFJx24B4nYx")
    .then(function (response) {
      // handle success
      const data = response.data.data.submissions
      console.log(data)
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    });

    return (
        <div>Hey, open console to see results.</div>
    )
}

export default Data