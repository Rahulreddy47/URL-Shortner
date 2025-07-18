
import React, { useState } from 'react';
import {
  Container, TextField, Button, Typography, Card, CardContent, Grid, Box
} from '@mui/material';
import axios from 'axios';
 
const App = () => {
  const [inputs, setInputs] = useState([{ url: '', validity: '', shortcode: '' }]);
  const [results, setResults] = useState([]);
 
  const handleChange = (index, field, value) => {
    const updatedInputs = [...inputs];
    updatedInputs[index][field] = value;
    setInputs(updatedInputs);
  };
 
  const handleAddMore = () => {
    if (inputs.length < 5) {
      setInputs([...inputs, { url: '', validity: '', shortcode: '' }]);
    } else {
      alert("You can only shorten up to 5 URLs at a time.");
    }
  };
 
  const handleSubmit = async () => {
    const newResults = [];
 
    for (const input of inputs) {
      if (!input.url || !/^https?:\/\//.test(input.url)) {
  newResults.push({ error: 'Invalid URL: ' + input.url });
  continue;
}

 
      try {
        const response = await axios.post('http://localhost:4000/shorturls', {
          url: input.url,
          validity: input.validity ? parseInt(input.validity) : undefined,
          shortcode: input.shortcode || undefined,
        });
        newResults.push(response.data);
      } catch (err) {
        newResults.push({ error: err.response?.data?.message || "Request failed" });
      }
    }
 
    setResults(newResults);
  };
 
  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom mt={3}>
        URL Shortener
      </Typography>
 
      {inputs.map((input, index) => (
        <Card key={index} variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Original URL"
                  fullWidth
                  value={input.url}
                  onChange={(e) => handleChange(index, 'url', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Validity (minutes)"
                  fullWidth
                  value={input.validity}
                  onChange={(e) => handleChange(index, 'validity', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Custom Shortcode"
                  fullWidth
                  value={input.shortcode}
                  onChange={(e) => handleChange(index, 'shortcode', e.target.value)}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
 
      <Box display="flex" gap={2} mb={4}>
        <Button variant="outlined" onClick={handleAddMore}>Add More</Button>
        <Button variant="contained" onClick={handleSubmit}>Shorten</Button>
      </Box>
 
      <Box mt={4}>
        <Typography variant="h5">Results:</Typography>
        {results.map((res, i) => (
          <Box key={i} mt={2} p={2} border="1px solid #ccc" borderRadius="8px">
            {res.error ? (
              <Typography color="error">{res.error}</Typography>
            ) : (
              <>
                <Typography>
                  <strong>Short Link:</strong>{' '}
                  <a href={res.shortLink} target="_blank" rel="noreferrer">{res.shortLink}</a>
                </Typography>
                <Typography><strong>Expires At:</strong> {res.expiry}</Typography>
              </>
            )}
          </Box>
        ))}
      </Box>
    </Container>
  );
};
 
export default App;
 