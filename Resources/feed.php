<?php

$url = sprintf("http://feeds.delicious.com/v2/json/%s?count=1000&private=%s=", $_GET['u'], urldecode($_GET['k']));

echo file_get_contents($url);
