"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { formatUnits } from "@ethersproject/units";
import { AddressZero } from "@ethersproject/constants";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  Button,
  Input,
  message,
  Space,
  Table,
  Breadcrumb,
  Card,
  Tag
} from "antd";
import { SyncOutlined, ExportOutlined } from "@ant-design/icons";
import { graphqlClient as client } from "@/app/utils";
import { explorerUrl } from "@/app/utils/config";
import {
  TOKEN_TRANSFERS_QUERY,
  TOKEN_DETAILS_QUERY
} from "@/app/utils/graphqlQueries";

dayjs.extend(relativeTime);

const tokenTransferColumns = [
  {
    title: "Transaction ID",
    key: "txHash",
    ellipsis: true,
    width: "5%",
    render: ({ txHash }) => (
      <Space>
        {txHash.slice(0, 15) + "..." + txHash.slice(-5)}
        <a
          href={`${explorerUrl}/tx/${txHash}`}
          target="_blank"
          rel="noreferrer"
        >
          <ExportOutlined
            title="View on Explorer"
            style={{ fontSize: "1rem" }}
          />
        </a>
      </Space>
    )
  },
  {
    title: "Age",
    key: "timestamp",
    width: "4%",
    sorter: (a, b) => a.timestamp - b.timestamp,
    render: ({ timestamp }) => dayjs(timestamp * 1000).fromNow(true)
  },
  {
    title: "From",
    key: "from",
    ellipsis: true,
    width: "8%",
    sorter: (a, b) => a?.from?.address.localeCompare(b?.from?.address),
    render: ({ from }) => (
      <Link href={`/address/${from.address}`}>{from.address}</Link>
    )
  },
  {
    title: "To",
    key: "to",
    ellipsis: true,
    width: "8%",
    sorter: (a, b) => a?.to?.address.localeCompare(b?.to?.address),
    render: ({ to }) => (
      <Link href={`/address/${to.address}`}>{to.address}</Link>
    )
  },
  {
    title: "Value",
    key: "value",
    width: "4%",
    sorter: (a, b) => a.value - b.value,
    render: ({ value, token, from, to }) => (
      <Space>
        {[from.address, to.address].includes(AddressZero) && (
          <Tag
            color={from.address === AddressZero ? "green" : "gold"}
            bordered={false}
          >
            {from.address === AddressZero ? "MINT" : "BURN"}
          </Tag>
        )}
        {formatUnits(value, token?.decimals).replace(/(\.\d{3}).*/, "$1") +
          " " +
          token?.symbol}
      </Space>
    )
  },
  {
    title: "Token",
    key: "token",
    width: "4%",
    sorter: (a, b) => a?.token?.name.localeCompare(b?.token?.name),
    render: ({ token }) => (
      <Link href={`/tokens/${token?.address}`}>{token?.name}</Link>
    )
  }
];

export default function Token({ params: { id } }) {
  const [dataLoading, setDataLoading] = useState(false);
  const [tokenTransfers, setTokenTransfers] = useState([]);
  const [tokenDetails, setTokenDetails] = useState({});

  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const pathName = usePathname();

  const getTokenTransfers = async () => {
    setDataLoading(true);
    client
      .request(TOKEN_TRANSFERS_QUERY, {
        skip: 0,
        first: 100,
        orderBy: "timestamp",
        orderDirection: "desc",
        where: {
          and: [
            { token: id },
            ...(searchQuery && [
              {
                or: [
                  { txHash_contains_nocase: searchQuery },
                  { from_contains_nocase: searchQuery },
                  { to_contains_nocase: searchQuery }
                ]
              }
            ])
          ]
        }
      })
      .then((data) => {
        setTokenTransfers(data.transfers);
        setDataLoading(false);
      })
      .catch((err) => {
        message.error("Something went wrong!");
        console.error("failed to get transfers: ", err);
        setDataLoading(false);
      });
  };

  const getTokenDetails = async () => {
    setDataLoading(true);
    client
      .request(TOKEN_DETAILS_QUERY, { id })
      .then((data) => {
        console.log(data.token);
        setTokenDetails(data.token);
        setDataLoading(false);
      })
      .catch((err) => {
        message.error("Something went wrong!");
        console.error("failed to get token details: ", err);
        setDataLoading(false);
      });
  };

  useEffect(() => {
    getTokenDetails();
    getTokenTransfers();
  }, []);

  return (
    <div>
      <Breadcrumb
        items={[
          {
            title: <Link href="/">Home</Link>
          },
          {
            title: <Link href="/tokens">Tokens</Link>
          },
          {
            title: <Link href={`/tokens/${id}`}>{id}</Link>
          }
        ]}
      />
      <Card
        loading={dataLoading}
        title="Token Information"
        style={{
          width: "100%",
          maxWidth: 500,
          margin: "0 auto"
        }}
        className="responsive-card"
      >
        <p>
          <strong>Name:</strong> {tokenDetails?.name || "Unknown"}
        </p>
        <p>
          <strong>Symbol:</strong> {tokenDetails?.symbol || "Unknown"}
        </p>
        <p>
          <strong>Address:</strong> {id || "Unknown"}
          <a
            href={`${explorerUrl}/token/${id}`}
            target="_blank"
            rel="noreferrer"
          >
            {" "}
            <ExportOutlined
              title="View on Explorer"
              style={{ fontSize: "1rem" }}
            />
          </a>
        </p>
        <p>
          <strong>Total Supply:</strong>{" "}
          {tokenDetails?.totalSupply
            ? formatUnits(
                tokenDetails?.totalSupply,
                tokenDetails?.decimals
              ).replace(/(\.\d{3}).*/, "$1")
            : "Unknown"}
        </p>
      </Card>
      <Space>
        <Input.Search
          placeholder="Search by address or transaction hash"
          value={searchQuery}
          enterButton
          allowClear
          onSearch={getTokenTransfers}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "") {
              router.push(`${pathName}`);
            } else {
              router.push(
                `${pathName}?q=${encodeURIComponent(e.target.value)}`,
                { scroll: false }
              );
            }
          }}
        />
        <Button type="primary" onClick={getTokenTransfers}>
          <SyncOutlined spin={dataLoading} />
        </Button>
      </Space>
      <Table
        className="table_grid"
        columns={tokenTransferColumns}
        rowKey="id"
        dataSource={tokenTransfers}
        scroll={{ x: 970 }}
        loading={dataLoading}
        pagination={{
          pageSizeOptions: [10, 25, 50, 100],
          showSizeChanger: true,
          defaultCurrent: 1,
          defaultPageSize: 10,
          size: "small"
        }}
        onChange={() => {}}
      />
    </div>
  );
}
