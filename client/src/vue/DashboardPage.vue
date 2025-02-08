<script setup>
import Navbar from './Navbar.vue';
import Footer from './Footer.vue';
</script>

<template>
    <Navbar />
    <div class="container">
        <div class="row mt-2 justify-content-between">
            <div class="col-3">
                <h1 class="fw-bold">Dashboard</h1>
            </div>
            <div class="col-4">
                <form class="d-flex pt-2" role="search">
                    <input class="form-control me-2" type="search" placeholder="Search by keyword or #tags..." aria-label="Search">
                    <button class="btn btn-primary" type="submit"><i class="bi bi-search"></i></button>
                </form>
            </div>
        </div>

        <div class="row mt-2">
            <div class="col-8">
                <h3 class="fw-bold">Your recent meals</h3>
            </div>
            <div class="col">
                <a href="#" class="btn btn-outline-primary float-end">See all meals <i class="bi bi-arrow-right"></i></a>
            </div>
        </div>

        <div class="row align-items-start mt-2">
            <div class="col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center">
                <div class="card" style="width: 18rem;">
                    <img src="../assets/placeholder.svg" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title fw-semibold">Meal title</h5>
                        <ul class="card-text">
                            <li>Ingredient 1</li>
                            <li>Ingredient 2</li>
                            <li>Ingredient 3</li>
                            <li>and [num] more...</li>
                        </ul>
                        <a href="#" class="btn btn-primary">Details</a>
                    </div>
                </div>
            </div>
            <div class="col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center">
                <div class="card" style="width: 18rem;">
                    <img src="../assets/placeholder.svg" class="card-img-top">
                    <div class="card-body">
                        <h5 class="card-title fw-semibold">Meal title</h5>
                        <ul class="card-text">
                            <li>Ingredient 1</li>
                            <li>Ingredient 2</li>
                            <li>Ingredient 3</li>
                            <li>and [num] more...</li>
                        </ul>
                        <a href="#" class="btn btn-primary">Details</a>
                    </div>
                </div>
            </div>
            <div class="col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center">
                <div class="card" style="width: 18rem;">
                    <img src="../assets/placeholder.svg" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title fw-semibold">Meal title</h5>
                        <ul class="card-text">
                            <li>Ingredient 1</li>
                            <li>Ingredient 2</li>
                            <li>Ingredient 3</li>
                            <li>and [num] more...</li>
                        </ul>
                        <a href="#" class="btn btn-primary">Details</a>
                    </div>
                </div>
            </div>
            <div class="col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center">
                <div class="card" style="width: 18rem;">
                    <img src="../assets/placeholder.svg" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title fw-semibold">Meal title</h5>
                        <ul class="card-text">
                            <li>Ingredient 1</li>
                            <li>Ingredient 2</li>
                            <li>Ingredient 3</li>
                            <li>and [num] more...</li>
                        </ul>
                        <a href="#" class="btn btn-primary">Details</a>
                    </div>
                </div>
            </div>
        </div>

        <div class="row mt-2">
            <div class="col">
                <h3 class="fw-bold">Your recent plans</h3>
            </div>
            <div class="col">
                <a href="#" class="btn btn-outline-primary float-end">See all plans <i class="bi bi-arrow-right"></i></a>
            </div>
        </div>

        <div class="row align-items-start mt-2">
            <div class="col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center">
                <div class="card" style="width: 18rem;">
                    <div class="card-body">
                        <h5 class="card-title fw-semibold">Plan title</h5>
                        <p class="card-text text-body-secondary fw-light">[num] meals &#8226; Last used MM/DD/YY</p>
                        <ul class="card-text">
                            <li>Meal 1</li>
                            <li>Meal 2</li>
                            <li>Meal 3</li>
                            <li>and [num] more...</li>
                        </ul>
                        <div class="row d-flex justify-content-center">
                            <div class="col"><a href="#" class="btn btn-outline-primary">Reuse plan</a></div>
                            <div class="col"><a href="#" class="btn btn-primary">Details</a></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center">
                <div class="card" style="width: 18rem;">
                    <div class="card-body">
                        <h5 class="card-title fw-semibold">Plan title</h5>
                        <p class="card-text text-body-secondary fw-light">[num] meals &#8226; Last used MM/DD/YY</p>
                        <ul class="card-text">
                            <li>Meal 1</li>
                            <li>Meal 2</li>
                            <li>Meal 3</li>
                            <li>and [num] more...</li>
                        </ul>
                        <div class="row d-flex justify-content-center">
                            <div class="col"><a href="#" class="btn btn-outline-primary">Reuse plan</a></div>
                            <div class="col"><a href="#" class="btn btn-primary">Details</a></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center">
                <div class="card" style="width: 18rem;">
                    <div class="card-body">
                        <h5 class="card-title fw-semibold">Plan title</h5>
                        <p class="card-text text-body-secondary fw-light">[num] meals &#8226; Last used MM/DD/YY</p>
                        <ul class="card-text">
                            <li>Meal 1</li>
                            <li>Meal 2</li>
                            <li>Meal 3</li>
                            <li>and [num] more...</li>
                        </ul>
                        <div class="row d-flex justify-content-center">
                            <div class="col"><a href="#" class="btn btn-outline-primary">Reuse plan</a></div>
                            <div class="col"><a href="#" class="btn btn-primary">Details</a></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center">
                <div class="card" style="width: 18rem;">
                    <div class="card-body">
                        <h5 class="card-title fw-semibold">Plan title</h5>
                        <p class="card-text text-body-secondary fw-light">[num] meals &#8226; Last used MM/DD/YY</p>
                        <ul class="card-text">
                            <li>Meal 1</li>
                            <li>Meal 2</li>
                            <li>Meal 3</li>
                            <li>and [num] more...</li>
                        </ul>
                        <div class="row d-flex justify-content-center">
                            <div class="col"><a href="#" class="btn btn-outline-primary">Reuse plan</a></div>
                            <div class="col"><a href="#" class="btn btn-primary">Details</a></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Footer />
</template>

<style scoped></style>