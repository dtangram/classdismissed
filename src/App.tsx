import React from 'react';
import Header from './components/Header';
import MainContent from './components/MainContent';
import Footer from './components/Footer';
import useModernizer from './hooks/useModernizer';

const DEFAULT_INPUT = `import React, { Component } from 'react';

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      user: null
    };
  }

  componentDidMount() {
    this.fetchUser();
  }

  fetchUser = async () => {
    const response = await fetch(\`https://api.example.com/user/\${this.props.id}\`);
    const data = await response.json();
    this.setState({ user: data, loading: false });
  }

  render() {
    const { loading, user } = this.state;
    if (loading) return <div>Loading...</div>;
    return (
      <div className="profile">
        <h1>{user.name}</h1>
        <p>{user.email}</p>
      </div>
    );
  }
}

export default UserProfile;`;

const App = () => {
  const {
    inputCode,
    setInputCode,
    result,
    loading,
    error,
    activeTab,
    setActiveTab,
    handleModernize,
    handleFormatSource,
    handleFormatRefined,
    copyToClipboard,
    downloadFile,
  } = useModernizer({ defaultInput: DEFAULT_INPUT });

  return (
    <section className="flex flex-col h-screen max-h-screen bg-bg">
      <Header loading={loading} onModernize={handleModernize} />
      <MainContent
        inputCode={inputCode}
        setInputCode={setInputCode}
        result={result}
        loading={loading}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleFormatSource={handleFormatSource}
        handleFormatRefined={handleFormatRefined}
        copyToClipboard={copyToClipboard}
        downloadFile={downloadFile}
      />
      <Footer loading={loading} error={error} />
    </section>
  );
};

export default App;
