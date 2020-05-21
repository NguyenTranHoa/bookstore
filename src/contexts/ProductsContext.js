import React from 'react';
import axios from 'axios';

export const ProductsContext = React.createContext();

const CancelToken = axios.CancelToken;
const source = CancelToken.source();

export class ProductsProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      displayCategory: null,
      keyword: '',
    }
    this.setCategory = this.setCategory.bind(this);
    this.setStateDefault = this.setStateDefault.bind(this);
    this.setKeyword = this.setKeyword.bind(this);
    this.filterProducts = this.filterProducts.bind(this);
  }

  componentDidMount() {
    if (this.state.products.length === 0) {
      axios.get('https://dvbt-bookstore.herokuapp.com/products', { cancelToken: source.token })
           .then(res => {
             this.setState({
               products: res.data
             })
           })
           .catch(err => {
             console.log(err);
           })
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.products === nextState.products 
      && this.state.displayCategory === nextState.displayCategory
      && this.state.keyword === nextState.keyword
    ) {
      return false;
    }
    return true;
  }

  componentWillUnmount() {
    source.cancel();
  }

  setCategory(category = '') {
    window.scrollTo({
      top: window.innerHeight - 90,
      behavior: "smooth"
    });
    this.setState({
      displayCategory: category
    })
  }

  setKeyword(keyword = '') {
    this.setState({
      keyword: keyword,
      displayCategory: null
    })
  }

  setStateDefault() {
    this.setState({
      displayCategory: null,
      keyword: ''
    })
  }

  filterProducts(category = '', keyword = '') {
    const { products } = this.state;
    if (category) {
      const filteredProducts = products.filter(function(product) {
        return product.category.indexOf(category) !== -1;
      });
      return filteredProducts;
    }
    if (keyword) {
      const filteredProducts = products.filter(function(product) {
        return product.title.toLowerCase().indexOf(keyword.toLowerCase()) !== -1;
      });
      return filteredProducts;
    }
    return products;
  }

  render() {
    const { displayCategory, keyword } = this.state;
    const products = this.filterProducts(displayCategory, keyword);
    return(
      <ProductsContext.Provider value={{
        products: products,
        setCategory: this.setCategory,
        setStateDefault: this.setStateDefault,
        setKeyword: this.setKeyword,
        categoryName: displayCategory,
        keyword: keyword
      }}>
        {this.props.children}
      </ProductsContext.Provider>
    );
  }
}